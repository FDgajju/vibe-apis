import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
import { AppError } from "../utils";
import type { AnyType } from "../types/globalTypes";

export const inputValidation = (schema: ZodObject<AnyType>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      return next(new AppError(error, 400));
    }
  };
};
