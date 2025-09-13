import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsAggregation,
  getPost,
  updatePost,
} from "./controller";
import { inputValidation } from "../../middlewares";

import { authenticate } from "../../middlewares/auth";
import { catchHandler } from "../../utils";
import { updatePostSchema } from "./validator";

const postRouter = Router();

postRouter.post("/", catchHandler(authenticate), catchHandler(createPost));
postRouter.get(
  "/",
  catchHandler(authenticate),
  catchHandler(getAllPostsAggregation)
);

postRouter.get("/:id", catchHandler(authenticate), catchHandler(getPost));
postRouter.patch("/:id", inputValidation(updatePostSchema), updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;