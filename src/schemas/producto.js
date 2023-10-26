import { z } from "zod";

export const createProductSchema = z.object({
  nombre: z
    .string(),
    // .min(3, {message:"Title must be at least 3 characters"})
    // .max(100,{message: "Title cannot exceed 100 characters"}),
  descripcion: z.string(),
   precio: z.string(),
  //   .number()
  //   .min(0,{message:"Price must be a non-negative number"})
  //   .transform((value) => parseFloat(value).toFixed(2)),
  stock: z.string()
    // .number()
    // .min(0,{message: "Stock must be a non-negative number"})
    // .int({message:"Stock must be a whole number"})
    
});
