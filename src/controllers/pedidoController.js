import Orden from "../models/Orden.js";
import Cliente from "../models/Cliente.js";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";
import { FRONTEND_URL,NGROK_URL } from "../config.js";
("../config.js");
import {createMercadoPagoPreference,updateOrderWithPaymentInfo} from "../libs/mercadoPago.js"
import { MercadoPagoConfig, Preference } from "mercadopago";
import axios from "axios";
export const getPedidos = async (req, res) => {
  try {
    console.log("orden")
    const pedidos = await Orden.find();
    res.json(pedidos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPedidoId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Orden.findOne({ _id: id }).populate('cliente')
 console.log("pedido ",pedido)
    if (!pedido) {
      return res.status(404).json({ message: "Orden not found" });
    }

    let clienteData = {
      nombre: "Cliente no encontrado",
      apellido: "",
      dni: "",
    };

    if (pedido.cliente) {
      clienteData = {
        nombre: pedido.cliente.nombre,
        apellido: pedido.cliente.apellido,
        dni: pedido.cliente.dni,
      };
    }

    // Mapea el pedido para incluir los datos del cliente
    const pedidoConDatosCliente = {
      ...pedido._doc,
      cliente: clienteData,
    };

    res.json(pedidoConDatosCliente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPedidosIdxIdUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const productos = await Orden.find({ usuario: idUsuario });
    res.json(productos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createPedido = async (req, res) => {
  try {
    const {
      usuario,
      ordenItems,
      DireccionEnvio,
      metodoPago,
      precioTotal,
      estadoPedido,
      fechaPedido,
      isDelivery,
      fechaDelivery,
    } = req.body;

    const cliente = await Cliente.findOne({ usuario: usuario._id });

    if (!cliente) {
      const newCliente = new Cliente({
        usuario: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        dni: usuario.dni,
      });
      await newCliente.save();
    }
    const clienteId = cliente ? cliente._id : newCliente._id;
    const nuevoPedido = new Orden({
      cliente: clienteId,
      ordenItems,
      DireccionEnvio,
      metodoPago,
      precioTotal: parseInt(precioTotal),
      estadoPedido,
      fechaPedido,
      isDelivery,
      fechaDelivery,
    });

    const resulPedido = await nuevoPedido.save();
    const id_orden = resulPedido._id.toString();
    
    const result = await createMercadoPagoPreference(ordenItems, usuario, `${NGROK_URL}/pedido/webhook`, id_orden);

    if (!result) {
      return res.status(500).json({
        message: "Error interno en el servidor para proceder mercado pago.",
      });
    }
    res.status(201).json({
      resulPedido,
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno en el servidor." });
  }
};
// export const createPedido = async (req, res) => {
//   try {
//     const {
//       usuario,
//       ordenItems,
//       DireccionEnvio,
//       metodoPago,
//       precioTotal,
//       estadoPedido,
//       fechaPedido,
//       isDelivery,
//       fechaDelivery,
//     } = req.body;
//     console.log(req.body);
//     const cliente = await Cliente.findOne({ usuario: usuario._id });

//     if (!cliente) {
//       const newCliente = new Cliente({
//         usuario: usuario._id,
//         nombre: usuario.nombre,
//         apellido: usuario.apellido,
//         telefono: usuario.telefono,
//         dni: usuario.dni,
//       });
//       await newCliente.save();
//     }

//     // Crea una preferencia de Mercado Pago
//     const client = new MercadoPagoConfig({
//       accessToken:
//         "TEST-3539892593181491-102401-7c1552ea411a979dd0883c30be9eb96e-1522496250",
//     });
//     const preference = new Preference(client);

//     const items = await Promise.all(
//       ordenItems.map(async (item) => {
//         const productDetails = await Producto.findById(item.producto);
//         return {
//           title: productDetails.nombre, 
//           currency_id: "PEN", 
//           quantity: item.cantidad, 
//           unit_price: Number(productDetails.precio), unitario
//         };
//       })
//     );

//     const body = {
//       items: items,
//       payer: {
//         name: usuario.nombre,
//         surname: usuario.apellido,
//         email: usuario.email,
//         phone: { area_code: "+51", number: usuario.telefono },
//         identification: {
//           type: "DNI",
//           number: usuario.dni, 
//         },
//       },
//       back_urls: {
//         success: `${FRONTEND_URL}/shop`,
//         failure: "https://www.failure.com",
//         pending: "https://www.pending.com",
//       },
//       notification_url: "https://cbc5-190-236-7-151.ngrok.io/pedido/webhook",
//       external_reference: id_orden,
//     };
//     console.log("preferenceData", body);


//     const result = await preference.create({ body }).catch((error) => {
//       console.log(error);
//       return res.status(500).json({
//         message: "Error interno en el servidor para proceder mercado pago.",
//       });
//     });
//     console.log("preferenceResponse", result);
//     // Crea el pedido y guarda el ID de la preferencia
//     const nuevoPedido = new Orden({
//       cliente: usuario._id,
//       ordenItems,
//       DireccionEnvio,
//       metodoPago,
//       precioTotal: parseInt(precioTotal),
//       estadoPedido,
//       fechaPedido,
//       isDelivery,
//       fechaDelivery,
//     });

//     const resulPedido = await nuevoPedido.save();

//     // Responde con el ID de la preferencia
//     res.status(201).json({
//       resulPedido,
//       result,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error interno en el servidor." });
//   }
// };
export const receiveWebhook = async (req, res) => {
  try {
    console.log("receiveWebhook");
    const payme = req.query;
    console.log("payme", payme);

    if (payme.type === "payment") {
      const paymentId = payme["data.id"];
      await updateOrderWithPaymentInfo(paymentId);
    }
    console.log("payme", payme);
  } catch (error) {
    console.log("Error:", error);
  }
};
export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const pedidoActualizado = await Orden.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true }
    );

    if (!pedidoActualizado) {
      return res.status(404).json({ message: "Orden not found" });
    }

    return res.json(pedidoActualizado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const Orden = await Orden.findById(id);

    if (!Orden) {
      return res.status(404).json({ message: "Orden not found" });
    }

    await Orden.findByIdAndDelete(id);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
