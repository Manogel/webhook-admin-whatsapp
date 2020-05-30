import "dotenv/config";
import express from "express";
import axios from "axios";
import socketio from "socket.io";
import http from "http";
// import socketWebhook from "./socketWebhook";

import webhookConfig from "./config/webhook";
import ProcessDataService from "./services/ProcessData.service";

const app = express();
const server = http.createServer(app);

const io = socketio(server);

app.use(express.json({ limit: "100000kb" }));
app.use(express.urlencoded({ extended: true, limit: "100000kb" }));

io.on("connection", (socket) => {
  console.log(`Socket conectado ${socket.id}`);
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

// socketWebhook.on("receivedMsg", async (data: any) => {
//   await ProcessDataService.execute(data);
//   await axios.post(webhookConfig.api_mchat_url, { webhook_data: data });
// });

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
