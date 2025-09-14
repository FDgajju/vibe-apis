import type { AnyType } from "../../types/globalTypes";
import { Reaction } from "./model";
import mongoose from "mongoose";
import type { MongoObjectId } from "../../types/globalTypes";

export const reactionCountAggregation = async (filter: AnyType) => {
  try {
    const data = await Reaction.aggregate([
      { $match: filter },
      { $group: { _id: "$reaction", count: { $sum: 1 } } },
    ]);

    return { status: true, data, error: null };
  } catch (error) {
    return { status: true, data: null, error };
  }
};

export const reactionCount = async (filter: AnyType) => {
  try {
    const data = await Reaction.countDocuments(filter);

    return { status: true, data, error: null };
  } catch (error) {
    return { status: true, data: null, error };
  }
};

export const createReactionService = async (
  user: any,
  params: {
    post?: string;
    comment?: string;
    reaction: string;
  }
) => {
  const { post, comment, reaction } = params;
  let isReacted = false;

  console.log(params);
  if ((!post && !comment) || (post && comment)) {
    return {
      status: false,
      statusCode: 400,
      error: "A reaction must belong to exactly one post or one comment.",
    };
  }

  const query: { by: string; post?: string; comment?: string } = {
    by: user,
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

  if (existingReaction) {
    if (existingReaction.reaction === reaction) {
      await existingReaction.deleteOne();
    } else {
      existingReaction.reaction = reaction;
      await existingReaction.save();
      isReacted = true;
    }
  } else {
    await Reaction.create({
      ...targetData,
      reaction,
      by: user,
    });
    isReacted = true;
  }

  const newCount = await reactionCount(targetData);

  return {
    status: true,
    data: { ...targetData, reaction_count: newCount.data, isReacted },
    statusCode: 200,
    error: null,
  };
};
