import type { Application, NextFunction, Request, Response } from "express";
import { HTTP_STATUS, PORT } from "../constants";
import { apiLogger, errorHandler } from "../middlewares";
import userRouter from "./user/router";
import postRouter from "./post/router";
import commentRouter from "./comment/router";
import fileRouter from "./file/router";
import authRouter from "./auth/router";
import reactionRouter from "./reaction/router";

export const injectRouters = (app: Application) => {
  app.use(apiLogger);

  app.use(
    "/api/health",
    (_req: Request, res: Response, _next: NextFunction) => {
      return res.status(HTTP_STATUS.OK).send({
        status: true,
        statusCode: HTTP_STATUS.OK,
        data: { message: "Looks Good :D" },
        error: null,
      });
    }
  );

  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/file", fileRouter);
  app.use("/api/post", postRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/reaction", reactionRouter);

  // if router not exists
  app.all("*", (req: Request, res: Response, _next: NextFunction) => {
    return res.status(HTTP_STATUS.NOT_FOUND).send({
      status: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      error: {
        message: `Route Not found ${req.method} : ${req.protocol}://${
          req.hostname
        }${
          req.hostname.startsWith("127") || req.hostname.startsWith("localhost")
            ? `:${PORT}`
            : ""
        }${req.originalUrl}`,
      },
      data: null,
    });
  });

  app.use(errorHandler);
};
