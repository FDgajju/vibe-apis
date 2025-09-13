import type { NextFunction, Request, Response } from "express";
import { AppError, filterData } from "../../utils";
import { User } from "../user/model";
import { DEFAULT_PROFILE_IMAGE, HTTP_STATUS } from "../../constants";
import { genJwtToken } from "../../lib/jwt";
import { compareHashAndData } from "../../lib";
import Setting from "../setting/model";

// sign up
export const signUp = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { body } = req;

  const data = filterData.addFields(body, [
    "fullName",
    "userName",
    "email",
    "bio",
    "password",
    "passwordConfirm",
  ]);

  console.log(data)

  data.profileImage = DEFAULT_PROFILE_IMAGE;

  const user = await User.create(data);

  await user.populate([{ path: "profileImage", select: "name key url type" }]);

  if (!user) throw new AppError("Signup failed", HTTP_STATUS.BAD_REQUEST);

  await Setting.create({ user: user._id });

  const token = genJwtToken({ _id: user._id });

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    statusCode: HTTP_STATUS.OK,
    data: {
      ...filterData.removeFields(user, ["password"]),
      token,
    },
    error: null,
  });
};

// sign in
export const signIn = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { body } = req;

  // Allow sign in with either email+password or just phone
  const data = filterData.addFields(body, ["user", "password"]) as {
    user?: string;
    password?: string;
  };

  // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email: data.user }, { userName: data.user }],
  })
    .populate([{ path: "profileImage", select: "name key url type" }] )
    .lean();

  if (!user)
    throw new AppError(
      "Invalid credentials, please try again.",
      HTTP_STATUS.NOT_FOUND
    );

  const validPassword = await compareHashAndData(
    data.password as string,
    user.password as string
  );
  if (!validPassword)
    throw new AppError(
      "Invalid credentials, please try again.",
      HTTP_STATUS.UNAUTHORIZED
    );

  const token = genJwtToken({ _id: user._id });

  return res.status(HTTP_STATUS.OK).send({
    status: true,
    statusCode: HTTP_STATUS.OK,
    data: { ...filterData.removeFields(user, ["password"]), token },
    error: null,
  });
};
