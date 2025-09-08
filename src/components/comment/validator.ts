import { z } from "../../lib";

export const createCommentSchema = z.object({
  body: z
    .object({
      comment: z.string().nonempty("Text is required"),
      post: z.string().optional(),
      parentComment: z.string().optional(),
    })
    .refine((data) => data.post || data.parentComment, {
      message: "Comment must be for either a post or a parent comment",
      path: ["post", "parentComment"],
    })
    .refine((data) => !(data.post && data.parentComment), {
      message: "Comment cannot be for both a post and a parent comment",
      path: ["post", "parentComment"],
    }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    comment: z.string().nonempty("Text is required").optional(),
  }),
});