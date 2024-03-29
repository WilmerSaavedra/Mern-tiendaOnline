import Orden from "../models/Orden.js";
import axios from "axios";
import isOnline from "is-online";

import {validarStock} from "../helpers/util.js";

import Producto from "../models/Producto.js";
import { TOKEN_ACCESS_MERCADOPAGO } from "../config.js";
("../config.js");
import { FRONTEND_URL } from "../config.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

export const createMercadoPagoPreference = async (
  ordenItems,
  usuario,
  notificationUrl,
  failureUrl,
  id_orden
) => {
  try {
    const online = await isOnline();

    if (!online) {
      return null;
    }
    const client = new MercadoPagoConfig({
      accessToken: TOKEN_ACCESS_MERCADOPAGO,
    });
    const preference = new Preference(client);

    const items = await Promise.all(
      ordenItems.map(async (item) => {
        const productDetails = await Producto.findById(item.producto);
        return {
          title: productDetails.nombre,
          currency_id: "PEN",
          quantity: item.cantidad,
          unit_price: Number(productDetails.precio),
        };
      })
    );

    const body = {
      items,
      payer: {
        name: usuario.nombre,
        surname: usuario.apellido,
        email: usuario.email,
        phone: { area_code: "+51", number: usuario.telefono },
        identification: {
          type: "DNI",
          number: usuario.dni,
        },
      },
      back_urls: {
        success: `${FRONTEND_URL}/pago`,
        failure: `${FRONTEND_URL}/${failureUrl}`,
        pending: "https://www.pending.com",
      },
      notification_url: notificationUrl,
      external_reference: id_orden,
    };

    // Crea la preferencia
    const result = await preference.create({ body }).catch((error) => {
      console.log(error);

      return null;
    });

    return result;
  } catch (error) {
    console.log(error);
    if (error.code === "ENOTFOUND") {
      // Manejar el error de conexión no encontrada de MercadoPago
      return null;
    } else {
      throw error; 
    }
  }
};
export const updateOrderWithPaymentInfo = async (paymentId) => {
  try {
    const paymentResponse = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN_ACCESS_MERCADOPAGO}`,
        },
      }
    );

    if (paymentResponse.status === 200) {
      const paymentInfo = paymentResponse.data;
      const orderId = paymentInfo.external_reference;
      const order = await Orden.findOne({ _id: orderId });
      const estadoPedido =
        paymentInfo.status === "approved"
          ? "Pedido Pagado"
          : paymentInfo.status;

      if (order) {
        // Verificar el stock antes de procesar el pago
        const isStockAvailable = await validarStock(order.ordenItems);

        if (isStockAvailable.success) {
          order.pagoResultado = {
            id: paymentInfo.id,
            status: estadoPedido,
            update_time: paymentInfo.date_approved,
            transaction_amount: paymentInfo.transaction_amount.toString(),
          };

          await order.save();
          await Promise.all(
            order.ordenItems.map(async (item) => {
              const product = await Producto.findById(item.producto);

              if (product) {
                product.stock -= item.cantidad;

                await product.save();
              } else {
                console.error("Producto no encontrado en la base de datos.");
              }
            })
          );
          console.log("Pago procesado con éxito:", paymentResponse);
        } else {
          console.error("No hay suficiente stock disponible:", isStockAvailable.errorDetails);
        }
      } else {
        console.error("Orden no encontrada en la base de datos.");
      }
    } else {
      console.error(
        "Fallo al obtener los detalles del pago:",
        paymentResponse.statusText
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
