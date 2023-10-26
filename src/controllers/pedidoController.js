import Orden from "../models/Orden.js";
import Cliente from "../models/Cliente.js";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await Orden.find();
    res.json(pedidos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPedidoId = async (req, res) => {
  try {
    const { id } = req.params;
    const Orden = await Orden.findById(id);

    if (!Orden) {
      return res.status(404).json({ message: "Orden not found" });
    }

    res.json(Orden);
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
console.log(req.body)
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

    // Crea una preferencia de Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken:
        "TEST-3539892593181491-102401-7c1552ea411a979dd0883c30be9eb96e-1522496250",
    });
    const preference = new Preference(client);

    // Define los ítems del pedido (esto debe ajustarse según tus datos)
    const items = await Promise.all(
      ordenItems.map(async (item) => {
        const productDetails = await Producto.findById(item.producto);
        return {
          title: productDetails.nombre, // Nombre del producto
          currency_id: "PEN", // Moneda (ajusta según tu configuración)
          quantity: item.cantidad, // Cantidad
          unit_price: Number(productDetails.precio), // Precio unitario
        };
      })
    );

    // Configura la preferencia con los datos del pedido
    const body = {
      items: items,
      payer: {
        name: usuario.nombre,
        surname: usuario.apellido,
        email: usuario.email,
        phone: { area_code: "+51", number: usuario.telefono },
        identification: {
          type: "DNI", // Tipo de identificación (ajusta según tu configuración)
          number: usuario.dni, // Número de identificación
        },
      },
      back_urls: {
        success: "https://www.success.com",
        failure: "https://www.failure.com",
        pending: "https://www.pending.com",
      },
      notification_url:"http://localhost:5173/about",
      auto_return: "approved",
      payment_methods: {
        excluded_payment_methods: [
          { id: "amex" },
          { id: "master" },
          { id: "visa" },
        ],
        excluded_payment_types: [],
        installments: 1,
      },
    };
    console.log("preferenceData", body);

    // Crea la preferencia
    const result = await preference.create({ body }).catch( (error) =>{
      console.log(error)
      return res.status(500).json({ message: "Error interno en el servidor para proceder mercado pago." });
    });
    console.log("preferenceResponse", result);
    // Crea el pedido y guarda el ID de la preferencia
    const nuevoPedido = new Orden({
      cliente: usuario._id,
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

    // Responde con el ID de la preferencia
    res.status(201).json({
      resulPedido,
      id: result.id,
      init_point: result.sandbox_init_point,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno en el servidor." });
  }
};

// export const createPedido = async (req, res) => {
//   try {
//     console.log("precioTotal",typeof req.body.uprecioTotal);

//     const {
//       usuario,
//       ordenItems,
//       DireccionEnvio,
//       metodoPago,
//       // pagoResultado,
//       precioTotal,
//       estadoPedido,
//       fechaPedido,
//       isDelivery,
//       fechaDelivery,
//     } = req.body;
//     const pagoResultado = {};
//     const cliente = await Cliente.findOne({ usuario: usuario._id });
//     console.log("cliente", cliente);
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
//     const nuevoPedido = new Orden({
//       cliente: usuario._id,
//       ordenItems,
//       DireccionEnvio,
//       metodoPago,
//       pagoResultado,
//       precioTotal: parseInt(precioTotal),
//       estadoPedido,
//       fechaPedido,
//       isDelivery,
//       fechaDelivery,
//     });
//     console.log("nuevoPedido", nuevoPedido);

//     // Guarda el nuevo Orden en la base de datos
//     const pedidoGuardado = await nuevoPedido.save();
//     console.log("pedidoGuardado", pedidoGuardado);
//     res.status(201).json(pedidoGuardado);
//   } catch (error) {
//     return res.status(500).json({ message: "Error interno en el servidor." });
//   }
// };

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
