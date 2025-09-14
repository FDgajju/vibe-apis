import { Comment } from "./model";
import { createOne, deleteOne, getAll, getOne } from "../handlerFactory";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { AppError } from "../../utils";
import { HTTP_STATUS } from "../../constants";
import { io } from "../../app";

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
  {
    path: "by",
    select: "fullName profileImage",
    populate: [{ path: "profileImage", select: "url type" }],
  },
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

export const createCommentWS = async (payload: {
  by: string;
  post?: string;
  parentComment?: string;
  comment: string;
}) => {
  try {
    if (!payload.by) throw new Error("Commented by user is required");

    console.log(payload);

    if (
      !payload.parentComment &&
      !payload.post &&
      payload.parentComment &&
      payload.post
    ) {
      throw new Error("The comment should belongs to comment or post");
    }

    if (payload.parentComment) {
      const parentComment = await Comment.findById(payload.parentComment);

      if (!parentComment) throw new Error("Parent comment not found");

      if (parentComment?.parentComment) {
        new Error("Cannot reply to replied comment");
      }
    }

    const newComment = await (await Comment.create(payload)).populate([
      { path: "by", select: "fullName profileImage", populate: [{path: "profileImage", select: "type url"}] },
      {
        path: "children_comments",
        select: "comment by",
        populate: [{ path: "by", select: "fullName profileImage" }],
      },
    ]);

    const roomId = payload.post || payload.parentComment;
    console.log(newComment);
    io.to(roomId as string).emit("commentAdded", newComment);
  } catch (error) {
    console.log("Error saving comment", error);
    throw new Error("Error saving comment");
  }
};

export const deleteComment = deleteOne(Comment);
