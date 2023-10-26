import { Router } from "express";
import {createPago
} from "../controllers/pagoController.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPagoSchema } from "../schemas/pago.js";
import { auth,isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.post(
    "/crear",
    // auth,
    // validateSchema(createPagoSchema),
    createPago
  );
export default router;