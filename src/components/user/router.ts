import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUsersForAdmin,
  getUserWithStats,
  updateSelf,
} from "./controller";
import { inputValidation } from "../../middlewares";
import { createUserSchema, updateUserSchema } from "./validator";
import { catchHandler } from "../../utils";
import { authenticate, authorization } from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/constant";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", catchHandler(authenticate), getUserWithStats);

userRouter.patch(
  "/update",
  catchHandler(authenticate),
  inputValidation(updateUserSchema),
  catchHandler(updateSelf)
);

// admin action
userRouter.use(catchHandler(authenticate), authorization(USER_ROLES.ADMIN));
userRouter.post(
  "/admin/create-employee",
  inputValidation(createUserSchema),
  catchHandler(createUser)
);

userRouter.get("/admin/employees", catchHandler(getUsersForAdmin));

export default userRouter;
