import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductId,
  getProducts,
  updateProduct,buscarProductos
} from "../controllers/productoController.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createProductSchema } from "../schemas/producto.js";
const router = Router();

router.get("/listar", getProducts);

router.post(
  "/crear",
  isAdmin,
  validateSchema(createProductSchema),
  createProduct
);

router.get("/obtener/:id", auth, getProductId);
router.get("/buscar/:parametro?", buscarProductos);


router.put(
  "/editar/:id",
  isAdmin,
  validateSchema(createProductSchema),
  updateProduct
);

router.delete("/eliminar/:id", isAdmin, deleteProduct);
// router.post("/likeProducto/:idProducto",auth, likeProduct);
export default router;
