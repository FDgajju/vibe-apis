import type { NextFunction, Response } from "express";
import type { ReqExtra } from "../types/globalTypes";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../utils";

import { User } from "../components/user/model.js";
import { verifyJwt } from "../lib/jwt.js";

export interface JwtPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (
  req: ReqExtra,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new AppError("Please login again!", HTTP_STATUS.FORBIDDEN);

    const token = authHeader.split(" ")[1];

    const decodedToken = verifyJwt(token) as JwtPayload;

    if (!decodedToken?._id) {
      throw new AppError("Invalid token payload", HTTP_STATUS.FORBIDDEN);
    }

    const user = await User.findOne({ _id: decodedToken?._id as string })
      .select(["-password"])
      .lean();

    if (!user) throw new AppError("Please login Again", HTTP_STATUS.FORBIDDEN);

    req.user = user; // Attach user payload to request
    next();
  } catch (error) {
    next(error);
  }
};
