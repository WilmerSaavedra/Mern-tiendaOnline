import Credito from "../models/Credito.js";
import Usuario from "../models/Usuario.js";
import Cita from "../models/Cita.js";
import Perfil from "../models/Perfil.js";
import moment from 'moment'; // Para trabajar con fechas
// Solicitar un crédito
import  Culqi from 'culqi-node';
// Configura Culqi con tu clave privada
const culqi = new Culqi({
  privateKey: 'sk_test_2a0f039bd9d2dadb', // Tu clave privada de Culqi
});
export const solicitarCredito = async (req, res) => {
  try {
    const {
      _id,
      productosSolicitados,
      dni,
      domicilio,
      telefono,
      historialCrediticio,
      ingresos,
    } = req.body;

    // Verificar si el perfil de usuario ya existe o crearlo si no existe
    let perfil = await Perfil.findOneAndUpdate(
      { usuario: _id },
      {
        dni,
        domicilio,
        telefono,
        historialCrediticio,
        ingresos,
      },
      { upsert: true, new: true }
    );

    // Crear una nueva cita utilizando la función del controlador de citas
    // Crea una nueva cita con el estado "Pendiente"
    const fechaHora = new Date(); // Obtiene la fecha actual
    fechaHora.setDate(fechaHora.getDate() + 7); // Suma 7 días
    const nuevoCita = new Cita({
      cliente: _id,
      fechaHora,
      estadoCita: "Pendiente",
    });
    await nuevoCita.save();
    const nuevaCita = await Cita.findOne({ cliente: _id });
    console.log("cita ", nuevaCita);
    // Crear un nuevo registro de crédito en estado "Pendiente" y asignar la cita y el perfil de usuario
    const nuevoCredito = new Credito({
      cliente: _id,
      productosSolicitados,
      estadoCredito: "Pendiente",
      fechaSolicitud: new Date(),
      citaReservada: nuevaCita._id,
      perfilCliente: perfil._id,
    });
    await nuevoCredito.save();

    res.json({ mensaje: "Crédito solicitado exitosamente" });
  } catch (error) {
    console.error("Error al solicitar el crédito:", error);
    res.status(500).json({ mensaje: "Error al solicitar el crédito" });
  }
};
// Aprobar un crédito
export const aprobarCredito = async (req, res) => {
  try {
    const { _id } = req.params;

    // Obtener el crédito por su ID
    const credito = await Credito.findById(_id);

    if (!credito) {
      return res.status(404).json({ mensaje: "Crédito no encontrado" });
    }
    // Obtener el cliente asociado al crédito
    const cliente = await Usuario.findById(credito.cliente);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    const perfil = await Perfil.findOne({ usuario: cliente._id });
    if (!perfil) {
      return res
        .status(404)
        .json({ mensaje: "Perfil de cliente no encontrado" });
    }
    // Realizar verificación de historial crediticio y ingresos aquí
    const historialCrediticio = perfil.historialCrediticio;
    const ingresos = perfil.ingresos;

    // Calcular el monto total aprobado sumando los precios de los productos solicitados
    const productosSolicitados = credito.productosSolicitados;
    let montoAprobado = 0;
    for (const producto of productosSolicitados) {
      montoAprobado += producto.precio;
    }

    // Verificar que el historial crediticio sea favorable y los ingresos sean suficientes
    if (historialCrediticio !== "Aceptable" || ingresos < montoAprobado) {
      return res.status(400).json({
        mensaje:
          "El cliente no cumple con los requisitos para aprobar el crédito",
      });
    }
    // Calcular la fecha de inicio del plan de pagos (1 semana después de la fecha de aprobación)
    const fechaAprobacion = new Date();
    const fechaInicioPago = new Date(fechaAprobacion);
    fechaInicioPago.setDate(fechaInicioPago.getDate() + 7);

    // Actualizar los datos del crédito
    credito.montoAprobado = montoAprobado;
    credito.fechaAprobacion = fechaAprobacion;
    credito.fechaInicioPago = fechaInicioPago;
    // Cambia el estado del crédito a "Aprobado"
    credito.estadoCredito = "Aprobado";
    await credito.save();
    res.json({ mensaje: "Crédito aprobado exitosamente" });
  } catch (error) {
    console.error("Error al aprobar el crédito:", error);
    res.status(500).json({ mensaje: "Error al aprobar el crédito" });
  }
};
// Función para registrar un pago semanal
export const registrarPagoSemanal = async (req, res) => {
 
    try {
      const { creditoId } = req.params;
      const { monto, token } = req.body; // El token de Culqi que recibiste del frontend
  
      // Verifica si el crédito existe (reemplaza 'Credito' con el nombre correcto de tu modelo)
      const credito = await Credito.findById(creditoId);
  
      if (!credito) {
        return res.status(404).json({ mensaje: 'Crédito no encontrado' });
      }
  
      // Calcula la fecha de vencimiento para este pago semanal
      const fechaActual = moment();
      const fechaVencimiento = fechaActual.add(1, 'week'); // Sumar 1 semana
  
      // Crea un nuevo registro de pago semanal
      const nuevoPago = new Pago({
        credito: credito._id,
        montoPago: monto,
        fechaPago: fechaActual,
        fechaVencimiento: fechaVencimiento,
        estadoPago: 'Pendiente',
      });
  
      // Guarda el nuevo pago en la base de datos
      await nuevoPago.save();
      const options = {
        method: 'POST',
        url: 'https://secure.culqi.com/v2/tokens/yape',
        headers: {
          Authorization: 'Bearer pk_test_UTCQSGcXW8bCyU59',
          'content-type': 'application/json'
        },
        body: {
          otp: '946627',
          number_phone: '951123456',
          amount: '500',
          metadata: {dni: '5831543'}
        },
        json: true
      };
     
        console.log(options.body);
      // Utiliza Culqi para crear el cargo (charge)
      const charge = await culqi.charges.createCharge({
        amount: monto,
        currency_code: 'PEN', // Moneda (soles peruanos, puedes ajustar esto)
        email: 'correo@ejemplo.com', // Correo del cliente (puedes ajustar esto)
        source_id: token, // El token de Culqi que recibiste del frontend
      });
  
      // Verifica el estado del cargo en Culqi
      if (charge.outcome.type === 'venta_exitosa') {
        // Actualiza el estado del pago a 'Pagado' si el cargo es exitoso
        nuevoPago.estadoPago = 'Pagado';
        await nuevoPago.save();
        return res.json({ mensaje: 'Pago semanal registrado y procesado exitosamente' });
      } else {
        // Si el cargo no es exitoso, puedes manejar el error apropiadamente
        console.error('Error en el cargo de Culqi:', charge.outcome.user_message);
        return res.status(400).json({ mensaje: 'Error en el cargo de Culqi' });
      }
    } catch (error) {
      console.error('Error al registrar el pago semanal:', error);
      res.status(500).json({ mensaje: 'Error al registrar el pago semanal' });
    }
};