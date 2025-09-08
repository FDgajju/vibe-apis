import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./controller";
import { inputValidation } from "../../middlewares";

import { authenticate } from "../../middlewares/auth";
import { catchHandler } from "../../utils";
import { updatePostSchema } from "./validator";

const postRouter = Router();

postRouter.post("/", catchHandler(authenticate), catchHandler(createPost));
postRouter.get("/", getAllPosts);

postRouter.get("/:id", getPost);
postRouter.patch("/:id", inputValidation(updatePostSchema), updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;
