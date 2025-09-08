import { Router } from "express";
import { getAllUsers, getUser, updateSelf } from "./controller";
import { inputValidation } from "../../middlewares";
import { userSchema } from "./validator";
import { catchHandler } from "../../utils";
import { authenticate } from "../../middlewares/auth";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);

userRouter.patch(
  "/update",
  catchHandler(authenticate),
  inputValidation(userSchema),
  catchHandler(updateSelf)
);


export default userRouter;
