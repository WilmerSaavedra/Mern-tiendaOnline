import Orden from "../models/Orden.js";
import Cliente from "../models/Cliente.js";
import Usuario from "../models/Usuario.js";
import isOnline from "is-online";
import { validarStock } from "../helpers/util.js";
import { FRONTEND_URL, NGROK_URL } from "../config.js";
import {
  createMercadoPagoPreference,
  updateOrderWithPaymentInfo,
} from "../libs/mercadoPago.js";
import axios from "axios";

const handleError = (res, status, message) => res.status(status).json({ message });
const handleSuccess = (res, data) => res.json(data);

const populateCliente = () => ({
  path: "cliente",
  select: "nombre apellido telefono dni _id",
});

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await Orden.find().populate(populateCliente());
    handleSuccess(res, pedidos);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const getPedidoId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Orden.findOne({ _id: id })
      .populate(populateCliente())
      .populate({
        path: "ordenItems.producto",
        model: "Product",
        select: "nombre precio",
      });

    if (!pedido) {
      return handleError(res, 404, "Orden not found");
    }

    const clienteData = pedido.cliente
      ? {
          nombre: pedido.cliente.nombre,
          apellido: pedido.cliente.apellido,
          dni: pedido.cliente.dni,
          telefono: pedido.cliente.telefono,
          _id: pedido.cliente._id,
        }
      : { nombre: "Cliente no encontrado", apellido: "", dni: "", telefono: "" };

    const pedidoConDatosCliente = { ...pedido._doc, cliente: clienteData };

    handleSuccess(res, pedidoConDatosCliente);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const getPedidosIdxIdUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const cliente = await Cliente.findOne({ usuario: idUsuario }).populate(
      "usuario"
    );

    if (!cliente) {
      return handleError(res, 404, "No se encontró un cliente para este usuario");
    }

    const productos = cliente !== null
      ? await Orden.find({ cliente: cliente._id }).populate(populateCliente())
      : {};

    handleSuccess(res, productos);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const createPedido = async (req, res) => {
  try {
    const {
      failureUrl,
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

    const io = req.io;
    const isStock = await validarStock(ordenItems);
console.log(usuario)
    if (!isStock.success) {
      const { errorDetails, productName } = isStock;
      return res.status(400).json({
        message: `No hay suficiente stock disponible para ${productName}.`,
        errorDetails,
      });
    }

    let cliente = await Cliente.findOne({ usuario: usuario._id });

    if (!cliente) {
      const newCliente = await Cliente.create({
        usuario: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        dni: usuario.dni,
      });

      cliente = newCliente;
    }

    const clienteId = cliente._id;
    const nuevoPedido = await Orden.create({
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
    const result = !usuario.isAdmin
      ? await createMercadoPagoPreference(
          ordenItems,
          usuario,
          `${NGROK_URL}/pedido/webhook`,
          failureUrl,
          id_orden
        )
      : {};

    io.emit("pedidoCreado", { resulPedido });

    if (!result) {
      return res.status(500).json({
        message: "Error interno en el servidor para proceder mercado pago.",
      });
    }

    handleSuccess(res, { resulPedido, result });
  } catch (error) {
    console.error(error);
    handleError(res, 500, "Error interno en el servidor.");
  }
};

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
  const { id } = req.params;

  try {
    const {
      failureUrl,
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

    const io = req.io;

    let cliente = id
      ? await Cliente.findById(usuario._id)
      : await Cliente.findOne({ usuario: usuario._id });

    if (!cliente) {
      const newCliente = await Cliente.create({
        usuario: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        dni: usuario.dni,
      });

      cliente = newCliente;
    }

    const clienteId = cliente._id;

    const existingPedido = await Orden.findById(req.params.id);

    if (!existingPedido) {
      return handleError(res, 404, "Pedido no encontrado.");
    }

    existingPedido.cliente = clienteId;
    existingPedido.ordenItems = ordenItems;
    existingPedido.DireccionEnvio = DireccionEnvio;
    existingPedido.metodoPago = metodoPago;
    existingPedido.precioTotal = parseInt(precioTotal);
    existingPedido.estadoPedido = estadoPedido;
    existingPedido.fechaPedido = fechaPedido;
    existingPedido.isDelivery = isDelivery;
    existingPedido.fechaDelivery = fechaDelivery;

    const updatedPedido = await existingPedido.save();

    const id_orden = updatedPedido._id.toString();
    const result = !usuario.isAdmin
      ? await createMercadoPagoPreference(
          ordenItems,
          usuario,
          `${NGROK_URL}/pedido/webhook`,
          failureUrl,
          id_orden
        )
      : {};

    io.emit("pedidoActualizado", { updatedPedido });
    console.log("Evento pedidoActualizado emitido con éxito:", {
      updatedPedido,
    });

    handleSuccess(res, { updatedPedido, result });
  } catch (error) {
    console.error(error);
    handleError(res, 500, "Error interno en el servidor.");
  }
};

export const createPago = async (req, res) => {
  try {
    const { id_orden } = req.params;
    console.log(id_orden);
    console.log(req.params);
    const failureUrl = "pedidos";
    const online = await isOnline();

    if (!online) {
      return handleError(res, 500, "No internet connection.");
    }

    const pedido = await Orden.findOne({ _id: id_orden })
      .populate(populateCliente())
      .populate({
        path: "ordenItems.producto",
        model: "Product",
        select: "nombre precio",
      });

    if (!pedido) {
      return handleError(res, 404, "Order not found.");
    }

    const result = await createMercadoPagoPreference(
      pedido.ordenItems,
      pedido.cliente,
      `${NGROK_URL}/pedido/webhook`,
      failureUrl,
      id_orden
    );

    if (!result) {
      return handleError(res, 500, "Error creating MercadoPago preference.");
    }

    handleSuccess(res, { pedido, result });
  } catch (error) {
    console.error(error);
    handleError(res, 500, "Internal server error.");
  }
};

export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const ordenList = await Orden.findById(id);

    if (!ordenList) {
      return handleError(res, 404, "Orden not found");
    }

    await Orden.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const updatePedidoDireccionEnvio = async (req, res) => {
  const { pedidoId } = req.params;
  const { direccion, referencia, localidad } = req.body;

  try {
    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return handleError(res, 404, "Pedido not found");
    }

    if (pedido.usuario._id.toString() !== req.user._id.toString()) {
      return handleError(res, 403, "Unauthorized");
    }

    pedido.DireccionEnvio.direccion = direccion;
    pedido.DireccionEnvio.referencia = referencia;
    pedido.DireccionEnvio.localidad = localidad;

    await pedido.save();

    handleSuccess(res, { message: "Pedido updated successfully" });
  } catch (error) {
    console.error("Error updating pedido:", error);
    handleError(res, 500, "Internal Server Error");
  }
};
