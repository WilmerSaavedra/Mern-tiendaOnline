import mongoose from "mongoose";

const ordenSchema = new mongoose.Schema(
  {
    cliente: {type: mongoose.Schema.Types.ObjectId, ref: "Cliente" 
    },

    ordenItems: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        cantidad: Number,
      },
    ],
    DireccionEnvio: {
      direccion: String,
      referencia: String,
      localidad: String,
    },
    metodoPago: { type: String, default: "Paypal" },
    pagoResultado: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    precioTotal: Number,
    estadoPedido: {
      type: String,
      enum: ["pendiente", "entregado", "cancelado"], // Valores permitidos para el estado del pedido
      default: "pendiente", // Valor predeterminado
    },
    fechaPedido: Date,
    isDelivery: Boolean,
    fechaDelivery: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Orden", ordenSchema);
