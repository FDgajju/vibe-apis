import { Router } from "express";
import {
  createConnection,
  getAllConnections,
  getConnection,
} from "./controller";
import { authenticate } from "../../middlewares/auth";
import { inputValidation } from "../../middlewares";
import { createConnectionsSchema } from "./validator";

const userConnectionRouter = Router();

userConnectionRouter.post(
  "/",
  authenticate,
  inputValidation(createConnectionsSchema),
  createConnection
);
userConnectionRouter.get("/", authenticate, getAllConnections);
userConnectionRouter.get("/:id", authenticate, getConnection);

export default userConnectionRouter;
