import type { NextFunction, Response } from "express";
import { AppError } from "../utils";
import * as fileTypeModule from "file-type";
import type { ReqExtra } from "../types/globalTypes";

export const fileCheck = async (
  req: ReqExtra,
  _res: Response,
  next: NextFunction
) => {
  const { file, files } = req;

  const allowFileTypes = [
    "jpg",
    "jpeg",
    "webp",
    "png",
    "gif",
    "mp4",
    "mkv",
  ];

  if (files) {
    // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
    for (const fObj of files as Express.Multer.File[]) {
      const type = await fileTypeModule.fileTypeFromBuffer(fObj.buffer);

      if (!type || !allowFileTypes.includes(type.ext)) {
        return next(new AppError("Not a valid file", 400));
      }
    }
  } else if (file) {
    const type = await fileTypeModule.fileTypeFromBuffer(file.buffer);

    if (!type || !allowFileTypes.includes(type.ext)) {
      return next(new AppError("Not a valid file", 400));
    }
  }

  next();
};
