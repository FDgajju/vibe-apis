import { Reaction } from "./model";
import { getAll, getOne } from "../handlerFactory";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../constants";
import { reactionCount } from "./service";

export const createReaction = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { user, body } = req;

  const { post, comment, reaction } = body;

  const filter = {
    by: user._id,
    $or: [{ post }, { comment }],
  };

  let checkReaction = await Reaction.findOne(filter);

  if (checkReaction) {
    if (checkReaction.reaction === reaction) await checkReaction.deleteOne();
    //  for now i am handling only heart reaction from ui side
    else {
      checkReaction.reaction = reaction;
      await checkReaction.save();
    }
  } else {
    checkReaction = await Reaction.create({
      post,
      comment,
      reaction,
      by: user._id,
    });
  }

  const newCount = await reactionCount({
    by: user._id,
    $or: [{ post }, { comment }],
  });

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    data: { comment, post, reactions: newCount.data },
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
