import { User } from "./model";
import { getAll, getOne } from "../handlerFactory";
import { AppError, filterData } from "../../utils";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../constants";

export const updateSelf = async (
  req: ReqExtra,
  res: Response,
  next: NextFunction
) => {
  const { body, user } = req;

  // 1) Create error if user POSTs password data
  if (body.password || body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
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
export const getUser = getOne(User);
