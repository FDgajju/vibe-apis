import { User } from "./model";
import { getAll, getOne } from "../handlerFactory";
import { AppError, filterData } from "../../utils";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../constants";
import { isValidObjectId } from "mongoose";

export const updateSelf = async (
  req: ReqExtra,
  res: Response,
  next: NextFunction
) => {
  const { body, user } = req;

  if (body.password || body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  const filteredBody = filterData.addFields(body, [
    "profileImage",
    "fullName",
    "userName",
    "email",
    "bio",
  ]);

  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: filteredBody },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

export const getAllUsers = getAll(User);

export const getUser = (req: ReqExtra, res: Response, next: NextFunction) => {
  if (!isValidObjectId(req.params.id)) throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

  return getOne(User, [{ path: "profileImage" }])(req, res, next);
};
