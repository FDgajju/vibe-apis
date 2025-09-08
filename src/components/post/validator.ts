import { z } from "../../lib";

// export const postSchema = z.object({
//   body: z
//     .object({
//       content: z
//         .string()
//         .nonempty("Content is required")
//         .max(280)
//         .min(5)
//         .optional(),
//       media: z.array(z.string()).optional(),
//     })
//     .refine(
//       (data) =>
//         data.content !== undefined ||
//         data.media !== undefined ||
//         (data.media &&
//           Array.isArray(data.media) &&
//           (data.media as Array<string>).length),
//       {
//         message:
//           "At least one field (content, or file) must be provided for update.",
//         path: ["body"],
//       }
//     ),
// });

export const updatePostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .nonempty("Content is required")
      .min(5)
      .max(280)
      .optional(),
    location: z.string().nonempty("Content is required").optional(),
  }),
});
