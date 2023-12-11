import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";

import {
  login,
  logout,
  register,
  verifyToken,
  sendEmail,
  getUsers,
  forgotPassword,
  deleteUserById,
  getUserById,
  updateUserById,obtenerUsuariosSinCliente,
} from "../controllers/usuarioController.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/usuario.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.get("/listar", getUsers);
router.get("/listarUserSinClientes", obtenerUsuariosSinCliente);

router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken);

router.post("/logout", logout);
router.post("/sendEmail", auth, sendEmail);
router.get("/obtener/:id", auth, getUserById);
router.delete("/eliminar/:id", auth, deleteUserById);

router.put(
  "/editar/:id",
  isAdmin,
//   validateSchema(createProductSchema),
updateUserById
);
export default router;
