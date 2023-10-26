import mongoose from "mongoose";

const perfil = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  dni: String,
  domicilio: String,
  telefono: String,
  historialCrediticio: String,
  ingresos: Number,
  puntajeCrediticio: Number,
  // Otros campos relacionados con la información financiera
});

export default mongoose.model(
  "Perfil",
  perfil
);