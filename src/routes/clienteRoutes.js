import { Router } from "express";
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerClientePorId,
  obtenerClientes,
  buscarClientes,
  obtenerClientePorIdUsuario
} from "../controllers/clienteController.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
// import { createProductSchema } from "../schemas/producto.js";
const router = Router();

router.get("/listar", obtenerClientes);

router.post(
  "/crear",
  auth,
//   validateSchema(createProductSchema),
  crearCliente
);

router.get("/obtener/:id", auth, obtenerClientePorId);
router.get("/obtenerXUsuario/:idUsuario", auth, obtenerClientePorIdUsuario);

router.get("/buscar/:parametro?", auth,buscarClientes);

router.put(
  "/editar/:id",
  auth,
//   validateSchema(createProductSchema),
  actualizarCliente
);

router.delete("/eliminar/:id", isAdmin, eliminarCliente);
// router.post("/likeProducto/:idProducto",auth, likeProduct);
export default router;
