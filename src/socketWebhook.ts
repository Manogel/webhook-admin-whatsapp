import socketio from "socket.io-client";

const socket = socketio("http://206.189.68.131:3341", {
  autoConnect: true,
  query: {
    user: "localhost-pc-manoel",
  },
});

socket.connect();
console.log(`📌 Connected in webhook: http://206.189.68.131:3341`);

export default socket;
