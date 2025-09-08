
import type { NextFunction, Request, Response } from 'express';
import type { Schema } from 'mongoose';

export type HandlerFUnction = (
  req: Request | ReqExtra,
  res: Response,
  next: NextFunction,
) => Promise<void> | Promise<Response<void>>;

export interface ReqExtra extends Request {
  //  biome-ignore lint:
  user?: any;
  //  biome-ignore lint:
  file?: any;
  //  biome-ignore lint:
  files?: any;
}

// biome-ignore lint:
export type ApplicationError = any;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AnyType = any


export type MongoObjectId = Schema.Types.ObjectId;
