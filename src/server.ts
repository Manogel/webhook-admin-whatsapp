import "dotenv/config";
import express from "express";
import socketio from "socket.io";
// import socketWebhook from "./socketWebhook";
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
});

app.post("/webhook", async (request, response) => {
  const data = request.body;
  // console.log(data);
  const message = await ProcessDataService.execute(data);
  if (message) {
    // console.log(message);
    io.emit(message.serviceId, message);
  }

  return response.send("ok");
});

// socketWebhook.on("receivedMsg", async (data) => {
//const message = await ProcessDataService.execute(data);
//console.log(message);
// if (message) {
//   console.log(message);
//   io.emit(message.serviceId, message);
// }
// });

server.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
