import { Reaction } from "./model";
import { getAll, getOne } from "../handlerFactory";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../constants";
import { createReactionService } from "./service";
import { AppError } from "../../utils";
import { io } from "../../app";

export const createReaction = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { user, body } = req;
  const result = await createReactionService(user, body);

  if (!result.status) throw new AppError(result.error);

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    data: result.data,
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

export const createReactionWS = async (data: {
  post: string;
  user: string;
  reaction: string;
}) => {
  try {
    const { post, user, reaction } = data;

    const updatedPost = await createReactionService(user, {
      post,
      reaction,
    });

    if (updatedPost.error) throw new Error(updatedPost.error);

    io.to(post).emit("updateLikes", {
      postId: post,
      newLikesCount: updatedPost.data?.reaction_count,
      isReacted: updatedPost.data?.isReacted,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Could not process like");
    // socket.emit('likeError',  { message: 'Could not process like.' });
  }
};

// export const updateReaction = updateOne(Reaction);
// export const deleteReaction = deleteOne(Reaction);
