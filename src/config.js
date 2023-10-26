import Culqi  from "culqi-node";
export const PORT = process.env.PORT || 4000;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bd-credit";
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";


// Configura las claves
Culqi.publicKey = "pk_test_7c839853df0c821d";
Culqi.secretKey = "sk_test_2a0f039bd9d2dadb";