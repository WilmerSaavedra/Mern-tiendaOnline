import { Router } from "express";
import {
  createPedido,
  deletePedido,
  getPedidoId,
  getPedidos,
  getPedidosIdxIdUsuario,
  updatePedido,
} from "../controllers/pedidoController.js";
import { auth,isAdmin } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPedidoSchema } from "../schemas/pedido.js";

const router = Router();

router.get("/listar", getPedidos);

router.post(
  "/crear",
  auth,
  validateSchema(createPedidoSchema),
  createPedido
);

router.get("/obtener/:id", auth, getPedidoId);
router.get("/obtenerxUsuaio/:id", auth, getPedidosIdxIdUsuario);
router.put(
  "/editar/:id",
  isAdmin,
  validateSchema(createPedidoSchema),
  updatePedido
);
router.delete("/eliminar/:id", isAdmin, deletePedido);

export default router;
