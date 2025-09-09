import { Reaction } from "./model";
import { getAll, getOne } from "../handlerFactory";
import type { MongoObjectId, ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../constants";
import { reactionCount } from "./service";
import mongoose from "mongoose";

export const createReaction = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { user, body } = req;
  const { post, comment, reaction } = body;

  if ((!post && !comment) || (post && comment)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({
      status: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      error: "A reaction must belong to exactly one post or one comment.",
    });
  }

  const query: { by: string; post?: string; comment?: string } = {
    by: user._id,
  };
  const targetData: {
    post?: MongoObjectId;
    comment?: MongoObjectId;
  } = {};

  if (post) {
    query.post = post;
    targetData.post = new mongoose.Types.ObjectId(post);
  } else {
    query.comment = comment;
    targetData.comment = new mongoose.Types.ObjectId(comment);
  }

  const existingReaction = await Reaction.findOne(query);

  console.log(existingReaction);
  if (existingReaction) {
    if (existingReaction.reaction === reaction) {
      await existingReaction.deleteOne();
    } else {
      existingReaction.reaction = reaction;
      await existingReaction.save();
    }
  } else {
    await Reaction.create({
      ...targetData,
      reaction,
      by: user._id,
    });
  }

  const newCount = await reactionCount(targetData);

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    data: { ...targetData, reactions: newCount.data },
    statusCode: HTTP_STATUS.OK,
    error: null,
  });
};

//
export const getReaction = getOne(Reaction, [
  {
    path: "by",
    select: "fullName profileImage",
    populate: [{ path: "profileImage", select: "url" }],
  },
]);
export const getAllReactions = getAll(Reaction, [
  {
    path: "by",
    select: "fullName profileImage",
    populate: [{ path: "profileImage", select: "url" }],
  },
]);
// export const updateReaction = updateOne(Reaction);
// export const deleteReaction = deleteOne(Reaction);
