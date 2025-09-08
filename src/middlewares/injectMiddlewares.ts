import cors from "cors";
import express, { type Application } from "express";
import { CORS_ALLOWED_ORIGINS } from "../constants";

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
};
