import { Router } from "express";
import {
  createReaction,
  getAllReactions,
  getReaction,
} from "./controller";
import { authenticate } from "../../middlewares/auth";
import { inputValidation } from "../../middlewares";
import { createReactionSchema } from "./validator";
import { catchHandler } from "../../utils";

const reactionRouter = Router();

reactionRouter.post(
  "/",
  catchHandler(authenticate),
  inputValidation(createReactionSchema),
  catchHandler(createReaction)
);

reactionRouter.get("/", getAllReactions);
reactionRouter.get("/:id", getReaction);

export default reactionRouter;
