import express, { type Application } from "express";
import { injectRouters } from "./components/injectRouter";
import { injectMiddleware } from "./middlewares";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { CORS_ALLOWED_ORIGINS } from "./constants";
import { injectWSocket } from "./components/injectWSocket";

const app: Application = express();
export const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  },
});


injectMiddleware(app);
injectWSocket(io);
injectRouters(app);

export default app;
