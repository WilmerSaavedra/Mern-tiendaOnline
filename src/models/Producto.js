import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: String,
      // required: true,
    },
    stock: {
      type: String,
      // required: true,
    },
    image: {
      principal: {
        url: String,
        public_id: String,
      },
      adicionales: [
        {
          url: String,
          public_id: String,
        },
      ],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // Modelo de datos de Usuario
      },
    ],
    rating: {
      type: Number,
      default: 0, // Valor inicial
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Product", productSchema);
