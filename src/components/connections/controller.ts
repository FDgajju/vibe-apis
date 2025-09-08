import { getAll, getOne } from "../handlerFactory";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../constants";
import Connection from "./model";

export const createConnection = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { user, body } = req;

  body.by = user._id;

  const filter = {
    by: user._id,
    followTo: body.followTo,
  };
  const existingConnection = await Connection.findOne(filter);

  if (existingConnection) {
    await existingConnection.deleteOne();
  } else {
    await Connection.create(body);
  }

  const count = await Connection.countDocuments(filter);

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    statusCode: HTTP_STATUS.OK,
    error: null,
    data: count,
  });
};

export const getConnectionMetrics = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { body, user } = req;
};

export const getConnection = getOne(Connection);
export const getAllConnections = getAll(Connection);

// export const deleteConnection = deleteOne(Connection);
