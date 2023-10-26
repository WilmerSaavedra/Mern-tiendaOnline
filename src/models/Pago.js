
import mongoose from "mongoose"
const pagoSchema = new mongoose.Schema({
  credito: { type: mongoose.Schema.Types.ObjectId, ref: 'Credito' }, // Referencia al crédito al que pertenece el pago
  fechaPago: Date, // Fecha en que se realiza el pago semanal
  montoPago: Number, // Monto del pago semanal
  estadoPago: String, // Estado del pago (Realizado, Atrasado, Pendiente, etc.)
  metodoPago: String,
});
export default mongoose.model(
  "Pago",
  pagoSchema
);