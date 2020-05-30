import "dotenv/config";
import express, { request } from "express";
import axios from "axios";
import socketio from "socket.io";
import http from "http";
import ProcessDataService from "./services/ProcessData.service";

const app = express();

app.use(express.json({ limit: "100000kb" }));
app.use(express.urlencoded({ extended: true, limit: "100000kb" }));

// Estraindo o protocolo utilizado pelo express
const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
  console.log(`${socket.handshake.query.user || socket.id} conectado.`);

  socket.on("sendMsg", (data) => {
    console.log("Enviando mensagem recebida...");
    socket.broadcast.emit("receivedMsg", data);
  });
});

app.post("/webhook", async (request, response) => {
  const data = request.body;
  // await axios.post(webhookConfig.api_mchat_url, { data });
  const message = await ProcessDataService.execute(data);
  if (message) {
    io.emit("receivedMsg", message);
  }

  return response.send("ok");
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
