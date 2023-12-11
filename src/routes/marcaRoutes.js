import { Router } from "express";
import {
  actualizarMarca,
  crearMarca,
  eliminarMarca,
  obtenerMarcaPorId,
  obtenerMarcas,
} from "../controllers/marcaController.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
// import { createProductSchema } from "../schemas/producto.js";
const router = Router();

router.get("/listar", obtenerMarcas);

router.post(
  "/crear",
  isAdmin,
//   validateSchema(createProductSchema),
  crearMarca
);

router.get("/obtener/:id", auth, obtenerMarcaPorId);

router.put(
  "/editar/:id",
  isAdmin,
//   validateSchema(createProductSchema),
  actualizarMarca
);

router.delete("/eliminar/:id", isAdmin, eliminarMarca);
// router.post("/likeProducto/:idProducto",auth, likeProduct);
export default router;
