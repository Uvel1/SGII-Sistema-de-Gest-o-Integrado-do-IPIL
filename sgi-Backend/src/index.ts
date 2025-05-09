import http from "http";
import WebSocket from "ws";
import { server } from "./server/server"; 

const PORT = process.env.PORT || 3333;

const httpServer = http.createServer(server);

export const wss = new WebSocket.Server({ server: httpServer });

wss.on("connection", (ws) => {
  console.log("Cliente conectado via WebSocket");

  const sendUpdates = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "update", data: "Novos dados..." }));
    }
  };

  const interval = setInterval(() => {
    sendUpdates();
  }, 5000);

  ws.on("message", (message) => {
    console.log(`Mensagem recebida: ${message}`);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
    clearInterval(interval); 
  });

  ws.send(JSON.stringify({ type: "info", data: "Conexão WebSocket estabelecida" }));
});

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
