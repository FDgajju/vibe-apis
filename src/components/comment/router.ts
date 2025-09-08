import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getComment,
  // updateComment,
} from "./controller";
import { inputValidation } from "../../middlewares";
import { createCommentSchema } from "./validator";
import { authenticate } from "../../middlewares/auth";
import { catchHandler } from "../../utils";

const commentRouter = Router();

commentRouter.get("/", getAllComments);
commentRouter.post(
  "/",
  catchHandler(authenticate),
  inputValidation(createCommentSchema),
  catchHandler(createComment)
);

commentRouter.get("/:id", getComment);
commentRouter.delete("/:id", catchHandler(authenticate), deleteComment);

export default commentRouter;
