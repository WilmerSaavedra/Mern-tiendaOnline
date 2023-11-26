import { z } from "zod";

export const pedidoSchema = z.object({
  metodoPago: z.string().min(1, "Seleccione un método de pago"),
  direccion: z.string().min(1, "Ingrese una dirección válida"),
  localidad: z.string().min(1, "Seleccione una localidad").refine((value) => value !== "0", {
    message: "Seleccione una localidad válida",
  }),
  referencia: z.string().min(6, "Ingrese una referencia válida"),
  nombre: z.string().min(3, "Ingrese un nombre válido"),
  apellido: z.string().min(4, "Ingrese un apellido válido"),
  telefono: z
    .string()
    .refine((value) => value.startsWith("9") && value.length === 9, {
      message: "Ingrese un número de teléfono válidos",
    }),
  dni: z
    .string()
    .min(1, "Ingrese un número de DNI válido")
    .min(8, "Ingrese un número de teléfono válido"),
});
