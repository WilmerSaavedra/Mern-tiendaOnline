import { z } from "zod";

export const productSchema = z.object({
  nombre: z
  .string({message: "El nombre es requerido"})
  .min(4, { message: "4 carateres como minimo" })
  .max(20, { message: "excedio el numero de carateres permitidos" })
  .refine((value) => /^[A-Za-z ]+$/.test(value), {
    message: "Caracteres premitos de A-Z",
  }),

  descripcion: z
  .string({
    message: "Descripcion is required",
  })
  .min(5, { message: "min 5 caracteres" })
  .max(255, { message: "max 255 caracteres" })
  .refine((value) => /^[A-Za-z ]+$/.test(value), {
    message: "Caracteres premitos de A-Z",
  }),
  precio: z.string({
    message: "Precio is required",
  })
  .refine((value) => {
    const pattern = /^\d+(\.\d{1,2})?$/;
    return pattern.test(value);
  }, "Precio válido mayor a 0.01")
  .transform((value) => parseFloat(value.replace(/\s/g, ""))),

  stock: z
  .string({
    message: "Stock is required",
  })
  .refine((value) => {
    const parsedValue = parseInt(value);
    return !isNaN(parsedValue) && Number.isInteger(parsedValue) && parsedValue > 0 && parsedValue < 1000;
  }, "Stock must be a valid positive integer between 1 and 999")
  .transform((value) => parseInt(value)),
  image: z.object({
    url: z.string({
      message: "Image URL is required",
    }),
    public_id: z.string({
      message: "Image public_id is required",
    }),
  }).refine((value) => {
    return value.url.trim() !== "" && value.public_id.trim() !== "";
  }, "Image is required"),
});
