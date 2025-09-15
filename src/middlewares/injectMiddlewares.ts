import cors from "cors";
import express, { type Application } from "express";
import { CORS_ALLOWED_ORIGINS } from "../constants";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

/*
    add allowed origins options in your env separated by comma
    eg. CORS_ALLOWED_ORIGINS=http://localhost:3000,https://example.com
*/

export const injectMiddleware = (app: Application) => {
  app.use(
    cors({
      methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
      origin: CORS_ALLOWED_ORIGINS,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(mongoSanitize());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
};
