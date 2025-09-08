import type { NextFunction, Response } from "express";
import type { AnyType, ReqExtra } from "../../types/globalTypes";
import { AppError } from "../../utils";
import { HTTP_STATUS } from "../../constants";
import { uploadFile } from "../../lib/r2";
import File from "./model";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { fileTypeFromBuffer } from "file-type";
import { Readable, PassThrough } from "stream";
import getVideoDurationInSeconds from "get-video-duration";

export const createFile = async (
  req: ReqExtra,
  res: Response,
  next: NextFunction
) => {
  const { user, file } = req;

  if (!file) {
    return next(new AppError("Please add a file", HTTP_STATUS.BAD_REQUEST));
  }

  if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

  const fileType = await fileTypeFromBuffer(file.buffer);

  let fileForUpload = file;
  let fileToUploadBuffer = file.buffer;
  let originalname = file.originalname;

  if (
    fileType &&
    fileType.mime.startsWith("video/") &&
    (await getVideoDurationFromBuffer(fileToUploadBuffer)) > 60
  ) {
    fileToUploadBuffer = await new Promise<Buffer>((resolve, reject) => {
      const inputReadableStream = new Readable();
      inputReadableStream.push(file.buffer);
      inputReadableStream.push(null);

      const outputStream = new PassThrough();
      const chunks: Buffer[] = [];

      outputStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      outputStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      ffmpeg(inputReadableStream)
        .inputOptions("-f", fileType.mime.split("/")[1])
        .duration(60)
        .videoCodec("copy")
        .audioCodec("copy")
        .outputOptions("-movflags", "frag_keyframe")
        .toFormat(fileType.mime.split("/")[1])
        .on("error", (err) => {
          console.error(
            "An error occurred during video processing:",
            err.message
          );
          reject(
            new AppError(
              `Video processing failed: ${err.message}`,
              HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
          );
        })
        .pipe(outputStream, { end: true });
    });

    // Update originalname to reflect trimming, e.g., add a suffix
    const ext = originalname.split(".").pop();
    const nameWithoutExt = originalname.substring(
      0,
      originalname.lastIndexOf(".")
    );
    originalname = `${nameWithoutExt}_trimmed.${ext}`;

    fileForUpload = {
      ...file,
      buffer: fileToUploadBuffer,
      originalname: originalname,
    };
  }

  // Create a new file object with the potentially trimmed buffer and updated originalname
  const uploadResp = await uploadFile(fileForUpload);

  if (!uploadResp || uploadResp.error) {
    throw new AppError(
      uploadResp?.error || "Something went wrong while uploading file",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  const doc = await File.create({
    name: originalname,
    key: (uploadResp.data as AnyType).filename,
    url: (uploadResp.data as AnyType).url,
    uploadedBy: user?._id,
  });

  return res.status(HTTP_STATUS.CREATED).send({
    status: true,
    error: null,
    data: doc,
    message: "File created",
  });
};

async function getVideoDurationFromBuffer(videoBuffer: Buffer) {
  const bufferStream = new Readable();
  bufferStream.push(videoBuffer);
  bufferStream.push(null); // Indicate end of stream

  try {
    const duration = await getVideoDurationInSeconds(bufferStream);
    console.log(`Video duration: ${duration} seconds`);
    return duration;
  } catch (error) {
    console.error("Error getting video duration:", error);
    throw error;
  }
}
