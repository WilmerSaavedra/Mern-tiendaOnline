import mongoose from "mongoose";

const creditoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  productosSolicitados: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      nombre: String,
      precio: Number,
      cantidad: Number,
    },
  ],
  fechaSolicitud: Date,
  estadoCredito: String, // Pendiente, Aprobado, Rechazado, Pagado, etc.

  productosGarantia: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
  ],
  citaReservada: { type: mongoose.Schema.Types.ObjectId, ref: "Cita" },
  montoAprobado: Number, // Monto total aprobado para el crédito
  fechaAprobacion: Date, // Fecha de aprobación del crédito
  fechaInicioPago: Date, // Fecha de inicio del plan de pagos
  plazoSemanas: Number, // Plazo en semanas para el pago del crédito
 
});

export default mongoose.model("Credito", creditoSchema);
