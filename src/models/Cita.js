import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fechaHora: Date,
  estadoCita: String, // Pendiente, Aprobada, Rechazada, Completada, etc.
});

export default mongoose.model('Cita', citaSchema);
