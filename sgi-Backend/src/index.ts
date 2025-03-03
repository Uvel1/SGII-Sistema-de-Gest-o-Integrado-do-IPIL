import http from "http";
import WebSocket from "ws";
import { server } from "./server/server"; // Importa o servidor Express já configurado

const PORT = process.env.PORT || 3333;

// Cria o servidor HTTP
const httpServer = http.createServer(server);

// Configura o WebSocket
export const wss = new WebSocket.Server({ server: httpServer });

wss.on("connection", (ws) => {
  console.log("Cliente conectado via WebSocket");

  // Função para enviar mensagens ao cliente
  const sendUpdates = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "update", data: "Novos dados..." }));
    }
  };

  // Envia mensagem a cada 5 segundos
  const interval = setInterval(() => {
    sendUpdates();
  }, 5000);

  ws.on("message", (message) => {
    console.log(`Mensagem recebida: ${message}`);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
    clearInterval(interval); // Evita vazamento de memória
  });

  // Enviar uma mensagem inicial para testar
  ws.send(JSON.stringify({ type: "info", data: "Conexão WebSocket estabelecida" }));
});

// Inicia o servidor HTTP + WebSocket
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
