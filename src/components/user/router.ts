import { Router } from "express";
import {
  getAllUsers,
  getUser,
  getUserWithStats,
  updateSelf,
} from "./controller";
import { inputValidation } from "../../middlewares";
import { updateUserSchema, userSchema } from "./validator";
import { catchHandler } from "../../utils";
import { authenticate } from "../../middlewares/auth";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", catchHandler(authenticate), getUserWithStats);

userRouter.patch(
  "/update",
  catchHandler(authenticate),
  inputValidation(updateUserSchema),
  catchHandler(updateSelf)
);

export default userRouter;
