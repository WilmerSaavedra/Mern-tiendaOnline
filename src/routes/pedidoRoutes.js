import { Router } from "express";
import {
  createPedido,
  deletePedido,
  getPedidoId,
  getPedidos,
  getPedidosIdxIdUsuario,
  updatePedido,
  receiveWebhook,createPago,updatePedidoDireccionEnvio
} from "../controllers/pedidoController.js";
import { auth,isAdmin } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPedidoSchema,UpdatePedidoSchema } from "../schemas/pedido.js";

const router = Router();

router.get("/listar", getPedidos);

router.post(
  "/crear",
  auth,
  validateSchema(createPedidoSchema),
  createPedido
);
router.get(
  "/pagar/:id_orden",
  auth,
  // validateSchema(createPedidoSchema),
  createPago
);
router.post(
  "/webhook", receiveWebhook
);
router.get(
  "/estadoPago", receiveWebhook
);
router.get("/obtener/:id", getPedidoId);
router.get("/obtenerxUsuaio/:idUsuario", auth, getPedidosIdxIdUsuario);
router.put(
  "/crudpedido/:id",
  auth,
  validateSchema(UpdatePedidoSchema),
  updatePedido
);
router.put(
  "/pedidoEnvio/:id",
  auth,
  // validateSchema(UpdatePedidoSchema),
  updatePedidoDireccionEnvio
);
router.delete("/eliminar/:id", auth, deletePedido);

export default router;
