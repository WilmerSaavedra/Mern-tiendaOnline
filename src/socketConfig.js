// socketConfig.js
import { Server as SocketIo } from 'socket.io';
import cors from "cors";
import { FRONTEND_URL } from "./config.js";

export default (server) => {
  const io = new SocketIo(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("Cliente conectado");
  
    // Ejemplo: Envía una notificación al cliente cuando ocurre un evento (nuevo pedido)
    socket.on("nuevo_pedido", (data) => {
      console.log("Nuevo pedido recibido:", data);
      io.emit("pedido_notification", data);
    });
  
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });

  return io;
};
