import { Post } from "./model";
import { deleteOne, getAll, getOne, updateOne } from "../handlerFactory";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import File from "../file/model";
import { AppError } from "../../utils/AppError";
import { HTTP_STATUS } from "../../constants/httpStatus";

export const createPost = async (
  req: ReqExtra,
  res: Response,
  next: NextFunction
) => {
  const { body, user } = req;

  if (
    body.content ||
    !body.media ||
    (body.media && Array.isArray(body.media) && !body.media.length)
  )
    throw new AppError(
      "Failed to Create Post, please add content",
      HTTP_STATUS.BAD_REQUEST
    );

  if (body.media && Array.isArray(body.media) && body.media.length) {
    const files = await File.find({ _id: { $in: body.media } });
    if (files.length !== body.media.length) {
      return next(
        new AppError(
          "Failed to Create Post, One or more media files do not exist",
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }
  }

  body.author = user._id;
  const doc = await Post.create(body);

  res.status(201).json({
    status: true,
    message: "Operation successful",
    error: null,
    data: doc,
  });
};

export const getPost = getOne(Post, [
  { path: "media", select: { name: 1, url: 1 } },
  {
    path: "author",
    select: { fullName: 1, profileImage: 1 },
    populate: [{ path: "profileImage", select: { name: 1, url: 1 } }],
  },
  // {
  //   path: "comments",
  //   populate: [
  //     { path: "by", select: "fullName profileImage" },
  //     // { path: "parentComment", select: "comment by" },
  //     {
  //       path: "children_comments",
  //       select: "comment by",
  //       populate: [{ path: "by", select: "fullName profileImage" }],
  //     },
  //   ],
  // },
]);

export const getAllPosts = getAll(Post, [
  { path: "media", select: { name: 1, url: 1 } },
  {
    path: "author",
    select: { fullName: 1, profileImage: 1 },
    populate: [{ path: "profileImage", select: { name: 1, url: 1 } }],
  },
  // {
  //   path: "comments",
  //   populate: [
  //     { path: "by", select: "fullName profileImage" },
  //     { path: "parentComment", select: "comment by" },
  //   ],
  // },
  // {
  //   path: "reactions",
  //   select: "by reaction",
  //   populate: {
  //     path: "by",
  //     select: { fullName: 1, profileImage: 1 },
  //     populate: [{ path: "profileImage", select: { url: 1 } }],
  //   },
  // },
]);
export const deletePost = deleteOne(Post);

export const updatePost = updateOne(Post);
