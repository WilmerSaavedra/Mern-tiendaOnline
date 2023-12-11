import mongoose from "mongoose";

const marca = new mongoose.Schema(
  {
    nombre: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Marca", marca);
