import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { catchHandler } from "../../utils";
import { createFile } from "./controller";
import { fileCheck } from "../../middlewares/fileCheck";
import { authenticate } from "../../middlewares/auth";
import type { AnyType } from "../../types/globalTypes";

const fileRouter = Router();

fileRouter.post(
  "/",
  catchHandler(authenticate),
  upload.single("file"),
  catchHandler(fileCheck),
  catchHandler(createFile as AnyType)
);

export default fileRouter;
