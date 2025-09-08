import { Comment } from "./model";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
} from "../handlerFactory";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { AppError } from "../../utils";
import { HTTP_STATUS } from "../../constants";

export const createComment = async (
  req: ReqExtra,
  res: Response,
  next: NextFunction
) => {
  req.body.by = req.user._id;

  if (req.body.parentComment) {
    const parentComment = await Comment.findById(req.body.parentComment);

    if (!parentComment) {
      return next(
        new AppError("Parent comment not found", HTTP_STATUS.NOT_FOUND)
      );
    }

    if (parentComment.parentComment) {
      return next(
        new AppError("Cannot reply to replied comment", HTTP_STATUS.BAD_REQUEST)
      );
    }
  }

  return createOne(Comment)(req, res, next);
};

export const getAllComments = getAll(Comment, [
  { path: "by", select: "fullName profileImage" },
  {
    path: "children_comments",
    select: "comment by",
    populate: [{ path: "by", select: "fullName profileImage" }],
  },
]);

export const getComment = getOne(Comment, [
  { path: "by", select: "fullName profileImage" },
  {
    path: "children_comments",
    select: "comment by",
    populate: [{ path: "by", select: "fullName profileImage" }],
  },
]);

export const deleteComment = deleteOne(Comment);
