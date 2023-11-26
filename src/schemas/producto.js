import { z } from "zod";

export const createProductSchema = z.object({
  nombre: z.string(),
  // .min(3, {message:"Title must be at least 3 characters"})
  // .max(100,{message: "Title cannot exceed 100 characters"}),
  // descripcion: z.string(),
  precio: z.string().refine(
    (precio) => {
      const regex = /^\d+(\.\d{1,2})?$/;
      return regex.test(precio);
    },
    { message: "Precio no válido" }
  ),

  stock: z.string().refine(
    (stock) => {
      const regex = /^[1-9]\d*$/;
      return regex.test(stock);
    },
    { message: "Stock no válido" }
  ),

  // .min(0,{message: "Stock must be a non-negative number"})
  // .int({message:"Stock must be a whole number"})
});
