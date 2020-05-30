import socketio from "socket.io-client";
import webhookConfig from "./config/webhook";

const socket = socketio(webhookConfig.webhook_url, {
  autoConnect: true,
});

socket.connect();
console.log(`📌 Connected in webhook: ${webhookConfig.webhook_url}`);

export default socket;
