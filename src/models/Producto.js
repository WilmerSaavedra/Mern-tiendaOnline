import mongoose from "mongoose";
const marcasValidas = [
  "nike",
  "adidas",
  "puma",
  "reebok",
  "converse",
  "vans",
  "new_balance",
  "under_armour",
  "asics",
  "fila",
  "other",
];

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
  
    genero: {
      type: String,
      enum: ["hombre", "mujer", "unisex"],
      // required: true,
    },
    estilo: {
      type: String,
      enum: ["urbano", "deportivo", "escolar"],
      // required: true,
    },
    marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca' },
    precio: {
      type: Number,
      // required: true,
    },
    tallas: {
      type: String,
      // required: true,
    },
    color: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      // required: true,
    },
    image: {
      principal: {
        url: String,
        public_id: String,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // Modelo de datos de Usuario
      },
    ],
    likesPorIP: [
      {
        ip: String,
        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    esLanzamientoNew: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
