import Culqi  from "culqi-node";
export const PORT = process.env.PORT || 4000;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bd-credit";
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const NGROK_URL = process.env.NGROK_URL || "https://ead0-190-234-21-121.ngrok.io";
export const TOKEN_ACCESS_MERCADOPAGO = process.env.TOKEN_ACCESS_MERCADOPAGO || "TEST-3539892593181491-102401-7c1552ea411a979dd0883c30be9eb96e-1522496250";

// Configura las claves
Culqi.publicKey = "pk_test_7c839853df0c821d";
Culqi.secretKey = "sk_test_2a0f039bd9d2dadb";