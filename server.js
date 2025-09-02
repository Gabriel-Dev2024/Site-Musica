import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static("public"));

// Chat via WebSocket
wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const formattedMsg = `Usuário: ${msg}`; // opcional
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(formattedMsg);
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});