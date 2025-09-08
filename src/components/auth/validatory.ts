import { z } from "../../lib";

export const signupSchema = z.object({
  body: z.object({
    fullName: z.string().nonempty("Full name is required"),
    userName: z.string().nonempty("username is required"),
    email: z.email("Not a valid email").nonempty("email is required"),
    password: z
      .string()
      .nonempty("password is required")
      .min(8, "Password must be at least 8 characters"),

    passwordConfirm: z
      .string()
      .nonempty("Password confirmation is required")
      .min(8, "Password must be at least 8 characters"),
    bio: z.string().optional(),
  }),
});

export const signinSchema = z.object({
  body: z.object({
    user: z
      .string("User field is required")
      .nonempty("User (email or username) must not be empty"),
    password: z
      .string("Password is required")
      .nonempty("password is required")
      .min(8, "Password must be at least 8 characters"),
  }),
});
