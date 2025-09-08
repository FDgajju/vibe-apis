import { z } from "zod";
import { REACTIONS } from "../../constants/constant";

export const createReactionSchema = z.object({
  body: z
    .object({
      post: z.string().optional(),
      comment: z.string().optional(),
      reaction: z.enum(REACTIONS),
    })
    .refine((data) => data.post || data.comment, {
      message: "Reaction must be for either a post or a comment",
      path: ["post", "comment"],
    })
    .refine((data) => !(data.post && data.comment), {
      message: "Reaction cannot be for both a post and a comment",
      path: ["post", "comment"],
    }),
});
