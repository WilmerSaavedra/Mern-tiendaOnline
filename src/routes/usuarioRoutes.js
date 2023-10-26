import { Router } from "express";
import { auth,isAdmin } from "../middlewares/auth.middleware.js";

import {
  login,
  logout,
  register,
  verifyToken,
  sendEmail
} from "../controllers/usuarioController.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/usuario.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken);
router.post("/logout", logout);
router.post("/sendEmail", auth,sendEmail);

export default router;
