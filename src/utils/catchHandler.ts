import type { NextFunction, Request, Response } from 'express';
import type { HandlerFUnction, ReqExtra } from '../types/globalTypes';

export const catchHandler = (fn: HandlerFUnction) => {
  return (req: ReqExtra | Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
