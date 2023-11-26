import { z } from "zod";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "jpeg",
  "jpg",
  "png",
  "webp",
];
function checkFileType(file) {
  console.log("checkFileType", file);
  if (file?.name) {
    
    const fileNameWithoutSpaces = file.name.replace(/\s+/g, '_');
    const fileType = fileNameWithoutSpaces.split(".").pop().toLowerCase();
    if (ACCEPTED_IMAGE_TYPES.includes(fileType)) return true;
  }
  return false;
}
export const productSchema = z.object({
  nombre: z
    .string({ message: "El nombre es requerido" })
    .min(4, { message: "4 carateres como minimo" })
    .max(20, { message: "excedio el numero de carateres permitidos" })
    .refine((value) => /^[A-Za-z ]+$/.test(value), {
      message: "Caracteres premitos de A-Z",
    }),

  // descripcion: z
  // .string({
  //   message: "Descripcion is required",
  // })
  // .min(5, { message: "min 5 caracteres" })
  // .max(255, { message: "max 255 caracteres" })
  // .refine((value) => /^[A-Za-z ]+$/.test(value), {
  //   message: "Caracteres premitos de A-Z",
  // }),
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
  genero: z
    .string()
    .refine((genero) => ["hombre", "mujer", "unisex"].includes(genero), {
      message: "Género no válido",
    }),

  estilo: z
    .string()
    .refine((estilo) => ["urbano", "deportivo", "escolar"].includes(estilo), {
      message: "Estilo no válido",
    }),

  marca: z.string().refine((marca) => ["nike", "adidas"].includes(marca), {
    message: "Marca no válida",
  }),

  color: z
    .string()
    .refine((color) => ["negro", "blanco", "azul"].includes(color), {
      message: "Color no válido",
    }),

  tallas: z.string().refine((talla) => ["39", "40", "41"].includes(talla), {
    message: "Talla no válida",
  }),
  imagenPrincipal: z.any()
  .refine((file) => {
    if (!file || file?.length === 0) {
      return "Ingrese Imagen";
    }
  
    // Verificar si solo se proporciona una URL
    const isOnlyURL = file[0]?.tempFilePath === undefined && file[0]?.name === undefined;
  
    // Si solo hay una URL, la validación es exitosa
    if (isOnlyURL) {
      return true;
    }
  
    // Continuar con las validaciones estándar para propiedades del archivo si se proporciona un nuevo archivo
    if (file[0]?.size >= MAX_FILE_SIZE) {
      return "Max size es 10MB.";
    }
  
    if (!checkFileType(file[0])) {
      return "Only .jpg, .gif, .png formats are supported.";
    }
  
    // Si todas las validaciones son exitosas
    return true;
  }, "Error en la validación de la imagen"),
 
  
});
