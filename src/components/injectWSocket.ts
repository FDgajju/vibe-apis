import type { Server } from "socket.io";

export const injectWSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("connected", socket.id);

    // test
    socket.on("send-message", (data) => {
      socket.broadcast.emit("receive-message", data);
    });

    socket.on("disconnected", (socket) => {
      console.log("disconnected", socket.id);
    });
  });
};
