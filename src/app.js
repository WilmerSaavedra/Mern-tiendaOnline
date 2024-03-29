import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import pagoRoutes from "./routes/pagoRoutes.js";
import marcaRoutes from "./routes/marcaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
// import creditoRoutes from "./routes/creditoRoutes.js";
// import citaRoutes from "./routes/citaRoutes.js";
import { FRONTEND_URL } from "./config.js";
import fileupload from "express-fileupload";
import { createServer } from "http";
import socketConfig from "./socketConfig.js";
import fs from "js-extra";
const app = express();
const server = createServer(app);
const io = socketConfig(server);
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);

app.use("/user", usuarioRoutes);
app.use("/cliente", clienteRoutes);
app.use("/marca", marcaRoutes);
app.use("/product", productoRoutes);
// app.use("/credit", creditoRoutes);
// app.use("/cite", citaRoutes);
app.use("/pedido", pedidoRoutes);
app.use("/pago", pagoRoutes);

if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "dist", "index.html"));
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default { app, server };
