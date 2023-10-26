import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
      },
      nombre: String,
      apellido: String,
      telefono:String,
      dni:String,
    });
    
    export default mongoose.model('Cliente', clienteSchema);