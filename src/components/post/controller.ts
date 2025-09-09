import { Post } from "./model";
import { deleteOne, getAll, getOne, updateOne } from "../handlerFactory";
import type { ReqExtra } from "../../types/globalTypes";
import type { NextFunction, Response } from "express";
import File from "../file/model";
import { AppError } from "../../utils/AppError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import mongoose from "mongoose";
import { filterData } from "../../utils";

export const createPost = async (
  req: ReqExtra,
  res: Response,
  next: NextFunction
) => {
  const { body, user } = req;

  if (
    !body.content &&
    (!body.media ||
      (body.media && Array.isArray(body.media) && !body.media.length))
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
  { path: "media", select: { name: 1, url: 1, type: 1 } },
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
  { path: "media", select: { name: 1, url: 1, type: 1 } },
  {
    path: "author",
    select: { fullName: 1, profileImage: 1, userName: 1 },
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

export const getAllPostsAggregation = async (
  req: ReqExtra,
  res: Response,
  _next: NextFunction
) => {
  const { user, query } = req;

  const filter = filterData.addFields(query, ["author", "location"]);

  if (filter.author) filter.author = new mongoose.Types.ObjectId(filter.author);

  if (query.isPrivate === "false" && query.author === user._id)
    filter.isPrivate = true;
  else filter.isPrivate = false;

  const page = parseInt(query.page as string, 10) || 1;
  const limit = parseInt(query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;

  const [result] = await Post.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },

    //reaction lookup
    {
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "post",
        as: "allReactions",
      },
    },
    // comment lookup
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "allComments",
      },
    },

    {
      $addFields: {
        myReaction: {
          $filter: {
            input: "$allReactions",
            as: "reaction",
            cond: {
              $eq: ["$$reaction.by", new mongoose.Types.ObjectId(user._id)],
            },
          },
        },
        likes: {
          $size: {
            $filter: {
              input: "$allReactions",
              as: "reactionDoc",
              cond: { 
                $in: ["$$reactionDoc.reaction", ["like", "heart", "haha", "wow"]] 
              }, // Count positive reactions
            },
          },
        },
        comments: { $size: "$allComments" },
      },
    },

    {
      $addFields: {
        isReacted: { $gt: [{ $size: "$myReaction" }, 0] },
        myReaction: { $arrayElemAt: ["$myReaction.reaction", 0] },
      },
    },

    // author lookup
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              fullName: 1,
              userName: 1,
              profileImage: 1,
            },
          },
        ],
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    {
      $lookup: {
        from: "files",
        localField: "author.profileImage",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
              key: 1,
              url: 1,
              type: 1,
            },
          },
        ],
        as: "author.profileImage",
      },
    },

    {
      $unwind: {
        path: "$author.profileImage",
        preserveNullAndEmptyArrays: true,
      },
    },

    // media lookup
    {
      $addFields: {
        media: {
          $map: {
            input: "$media",
            as: "mediaIdString",
            in: { $toObjectId: "$$mediaIdString" },
          },
        },
      },
    },
    {
      $lookup: {
        from: "files",
        localField: "media",
        foreignField: "_id",
        as: "media",
        pipeline: [
          {
            $project: {
              name: 1,
              key: 1,
              url: 1,
              type: 1,
            },
          },
        ],
      },
    },

    {
      $project: {
        allReactions: 0,
        allComments: 0,
      },
    },

    {
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalCount =
    result.totalCount.length > 0 ? result.totalCount[0].count : 0;

  res.status(200).send({
    status: true,
    statusCode: HTTP_STATUS.OK,
    error: null,
    meta: {
      limit,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      result: totalCount,
    },
    data: result.paginatedResults,
  });
};
