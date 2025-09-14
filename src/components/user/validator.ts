import { USER_ROLES } from "../../constants/constant";
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

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().nonempty("Full name is required"),
    userName: z.string().nonempty("username is required"),
    email: z.email("Not a valid email").nonempty("email is required"),
    mobile: z.string().min(10).max(10).optional(),
    role: z.enum(Object.values(USER_ROLES) as [string, ...string[]]),
    password: z.string().nonempty("username is required"),
  }),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      fullName: z.string().nonempty("Full name is required").optional(),
      userName: z.string().nonempty("username is required").optional(),
      email: z
        .email("Not a valid email")
        .nonempty("email is required")
        .optional(),
      bio: z.string().optional(),
      profileImage: z.string().optional(),
    })
    .refine(
      (data) =>
        data.fullName !== undefined ||
        data.userName !== undefined ||
        data.email !== undefined ||
        data.profileImage !== undefined ||
        data.bio !== undefined,
      {
        message: "At least one field must be provided for update.",
        path: ["body"],
      }
    ),
});
