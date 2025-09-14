import { User } from "./model";
import { getAll, getOne } from "../handlerFactory";
import { AppError, filterData } from "../../utils";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../constants";
import mongoose, { isValidObjectId, PopulateOptions } from "mongoose";
import { MODEL_NAMES } from "../../constants";
import Connection from "../connections/model";

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
    status: true,
    statusCode: HTTP_STATUS.OK,
    error: null,
    data: updatedUser,
  });
};

// get all
export const getAllUsers = getAll(User);

// get one
export const getUser = (req: ReqExtra, res: Response, next: NextFunction) => {
  if (!isValidObjectId(req.params.id))
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

  return getOne(User, [{ path: "profileImage" }])(req, res, next);
};

// get one with stats
export const getUserWithStats = async function (
  req: ReqExtra,
  res: Response,
  next: NextFunction
) {
  const { user, params } = req;

  if (!isValidObjectId(params.id))
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

  const userDetails = await User.findOne({ _id: params.id })
    .populate([
      { path: "profileImage", select: "url type" },
      { path: "follower_count" },
      { path: "following_count" },
      { path: "post_count" },
    ])
    .lean();

  if (!userDetails) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  // console.log(user);
  if (user) {
    // console.log({ followTo: userDetails._id, by: user._id });
    const connection = await Connection.findOne({
      followTo: userDetails._id.toString(),
      by: user._id.toString(),
    });

    (userDetails as any).isFollowing = !!connection;
    // console.log(connection);
  } else {
    (userDetails as any).isFollowing = false;
  }

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    statusCode: HTTP_STATUS.OK,
    error: null,
    data: userDetails,
  });
};
