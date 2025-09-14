import { User } from "./model";
import { getAll, getOne } from "../handlerFactory";
import { AppError, filterData } from "../../utils";
import type { AnyType, ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { DEFAULT_PROFILE_IMAGE, HTTP_STATUS } from "../../constants";
import { isValidObjectId } from "mongoose";
import Connection from "../connections/model";
import APIFeatures from "../../utils/apiFeatures";

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
  _next: NextFunction
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

    (userDetails as AnyType).isFollowing = !!connection;
    // console.log(connection);
  } else {
    (userDetails as AnyType).isFollowing = false;
  }

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    statusCode: HTTP_STATUS.OK,
    error: null,
    data: userDetails,
  });
};

// admin action
export const createUser = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { body } = req;

  const data = filterData.addFields(body, [
    "fullName",
    "userName",
    "email",
    "mobile",
    "password",
    "passwordConfirm",
    "role",
    "profileImage",
  ]);

  data.profileImage = DEFAULT_PROFILE_IMAGE;

  const createdUser = await User.create(data);

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    statusCode: HTTP_STATUS.OK,
    error: null,
    data: createdUser,
  });
};

export const getUsersForAdmin = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { user, query } = req;


  const filter = { role: { $ne: "USER" }, _id: { $ne: user._id } }

  const features = new APIFeatures(
    User.find(filter),
    query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [users, docCount] = await Promise.all([
    features.query.populate([{ path: "profileImage", select: "url type" }]),
    User.countDocuments({...filter, ...features.filterPayload}),
  ]);

  const limit = Number(query.limit) || 10;
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(docCount / limit);

  res.status(HTTP_STATUS.OK).json({
    status: true,
    statusCode: HTTP_STATUS.OK,
    error: null,
    meta: {
      limit,
      currentPage,
      totalPages,
      result: docCount,
    },
    data: users,
  });
};
