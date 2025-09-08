import { z } from "../../lib";

export const userSchema = z.object({
  body: z
    .object({
      fullName: z.string().nonempty("Full name is required").optional(),
      userName: z.string().nonempty("username is required").optional(),
      email: z
        .email("Not a valid email")
        .nonempty("email is required")
        .optional(),
      bio: z.string().optional(),
    })
    .refine(
      (data) =>
        data.fullName !== undefined ||
        data.userName !== undefined ||
        data.email !== undefined ||
        data.bio !== undefined,
      {
        message: "At least one field must be provided for update.",
        path: ["body"],
      }
    ),
});
