import type { Server } from "socket.io";
import { createReactionWS } from "./reaction/controller";
import { createCommentWS } from "./comment/controller";

export const injectWSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("connected", socket.id);

    socket.on("joinPostRoom", (postId) => {
      socket.join(postId); 
      console.log(`Socket ${socket.id} joined room ${postId}`);
    });

    socket.on("leavePostRoom", (postId) => {
      socket.leave(postId);
      console.log(`Socket ${socket.id} left room ${postId}`);
    });

    socket.on("likePost", createReactionWS);
    socket.on("commentPost", createCommentWS); 

    socket.on("disconnected", (socket) => {
      console.log("disconnected", socket.id);
    });
  });
};
