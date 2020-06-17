import socketio from "socket.io-client";

const socket = socketio("http://206.189.68.131:3331", {
  autoConnect: true,
  query: {
    user: "localhost-pc-manoel",
  },
});

socket.connect();
console.log(`📌 Connected in webhook: http://206.189.68.131:3331`);

export default socket;
