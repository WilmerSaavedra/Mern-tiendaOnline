import { z } from "zod";

export const createPagoSchema = z.object({
  usuario: z.object({
    _id: z.string().min(1, { message: "ID de usuario no ingresado" }),
    nombre: z.string().min(1, { message: "El nombre no debe estar vacío" }),
    apellido: z.string().min(1, { message: "El apellido no debe estar vacío" }),
    telefono: z.string().min(1, { message: "El teléfono no debe estar vacío" }),
    dni: z.string().min(1, { message: "El DNI no debe estar vacío" }),
  }),
  ordenItems: z.array(
    z.object({
      producto: z.string().min(1, { message: "ID de producto no ingresado" }),
      cantidad: z.number().min(1, { message: "La cantidad debe ser un número mayor a 0" }),
    })
  ),
  DireccionEnvio: z.object({
    direccion: z.string().min(1, { message: "La dirección no debe estar vacía" }),
    referencia: z.string().min(1, { message: "La referencia no debe estar vacía" }),
    localidad: z.string().min(1, { message: "La localidad no debe estar vacía" }),
  }),
  metodoPago: z.string().min(1, { message: "El método de pago no debe estar vacío" }),
  precioTotal: z.number().min(0, { message: "El precio total debe ser un número mayor o igual a 0" }),
  estadoPedido: z.enum(["pendiente", "entregado", "cancelado"], {
    message: "El estado del pedido no es válido",
  }),
});
