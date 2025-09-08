import type { NextFunction, Response } from "express";
import { NODE_ENV } from "../constants";
import type { AnyType, ApplicationError, ReqExtra } from "../types/globalTypes";
import { AppError } from "../utils";
import type { ZodError } from "zod";

//
const handleCastErrorDB = (err: ApplicationError) => {
  const message = `Invalid ${err.details.path}: ${err.details.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: ApplicationError) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0]; // error message property name message
  const message = `Duplicate field value: ${value} Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: ApplicationError) => {
  const errors = Object.values(err.errors).map(
    // biome-ignore lint:
    (el: any, _i) => el.path
  );

  const message = `There are ${errors.length} Invalid input data in path - [ ${errors} ]`;
      
  return new AppError(message, 400);
};

const handleZodError = (err: ZodError) => {
  console.log(err);
  const errors = JSON.parse(err.message).map((issue: AnyType) => {
    return `${issue.message}`;
  });
  const message = `Invalid input data: ${errors.join("; ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (_err: ApplicationError) =>
  new AppError("Invalid Token! Please log in again.", 401);

const handleJWTExpError = (_err: ApplicationError) =>
  new AppError("Login session expired please login again.", 401);

// const sendErrorDev = (err: ApplicationError, res: Response) => {
//   console.error("ERROR 💥", err);
//   return res.status(err.statusCode).send({
//     status: false,
//     statusCode: err.statusCode,
//     data: null,
//     error: {
//       message: err.message,
//     },
//   });
// };

const sendError = async (
  err: ApplicationError,
  res: Response,
  _req: ReqExtra
) => {
  console.error("ERROR 💥", err);

  if (NODE_ENV === "dev")
    return res.status(err.statusCode).send({
      status: false,
      statusCode: err.statusCode,
      data: null,
      error: {
        message: err.message,
        stack: err.stack,
      },
    });
  else
    return res.status(err.statusCode).send({
      status: false,
      statusCode: err.statusCode,
      data: null,
      error: {
        message: err.message,
      },
    });
};

export const errorHandler = (
  err: ApplicationError,

  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || false;
  let error;
  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);
  if (err.name === "ZodError") error = handleZodError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError(err);
  if (err.name === "TokenExpiredError") error = handleJWTExpError(err);

  sendError(error ? error : err, res, req);
};
