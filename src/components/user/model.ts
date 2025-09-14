import { Schema, model } from "mongoose";
import { MODEL_NAMES } from "../../constants";
import type { MongoObjectId } from "../../types/globalTypes";
import { hashString } from "../../lib";
import { USER_ROLES } from "../../constants/constant";

export type UserModelT = {
  fullName: string;
  userName: string;
  email: string;
  mobile: string;
  password: string;
  passwordConfirm?: string;
  role?: UserRoles;
  bio?: string | null;
  profileImage?: string | MongoObjectId;
};

export enum UserRoles {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  ACCOUNTANT = "ACCOUNTANT",
  USER = "USER",
}

export interface UserT
  extends Omit<UserModelT, "password" | "passwordConfirm"> {}

const UserSchema = new Schema<UserModelT>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    userName: {
      type: String,
      unique: [true, "The user name already taken"],
      required: [true, "username is required"],
    },
    email: {
      type: String,
      unique: [true, "The email already registered "],
      required: [true, "username is required"],
    },

    mobile: {
      type: String,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    bio: {
      type: String,
    },
    profileImage: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.FILE,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashString(this.password);

  this.passwordConfirm = undefined;
  next();
});

UserSchema.virtual("follower_count", {
  ref: MODEL_NAMES.CONNECTION,
  localField: "_id",
  foreignField: "followTo",
  count: true,
});

UserSchema.virtual("following_count", {
  ref: MODEL_NAMES.CONNECTION,
  localField: "_id",
  foreignField: "by",
  count: true,
});

UserSchema.virtual("post_count", {
  ref: MODEL_NAMES.POST,
  localField: "_id",
  foreignField: "author",
  count: true,
});

export const User = model<UserModelT>(MODEL_NAMES.USER, UserSchema);
