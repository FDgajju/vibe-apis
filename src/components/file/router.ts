import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { catchHandler } from "../../utils";
import { createFile } from "./controller";
import { fileCheck } from "../../middlewares/fileCheck";

const fileRouter = Router();

fileRouter.post(
  "/",
  upload.single("file"),
  catchHandler(fileCheck),
  catchHandler(createFile)
);

export default fileRouter;
