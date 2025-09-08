import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  R2_ACCESS_KEY_ID,
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  R2_PUB_ACCOUNT_ID,
  R2_SECRET_ACCESS_KEY,
  R2_SIGNED_URL_EXPIRY_TIME,
} from "../constants";
import type { AnyType } from "../types/globalTypes";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const uploadFile = async (file: AnyType) => {
  try {
    const filename = `${Date.now()}-${file.originalname.split(" ").join("+")}`;
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
    };

    const command = new PutObjectCommand(params);
    const uploadInfo = await r2.send(command);

    const url = `https://${R2_PUB_ACCOUNT_ID}.r2.dev/${filename}`;

    return {
      status: true,
      error: null,
      data: { info: { ...uploadInfo }, filename, url },
    };
  } catch (error) {
    return { status: false, error, data: null };
  }
};

export const genSignedDownloadUrl = async (fileName: string) => {
  try {
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    };

    const command = new GetObjectCommand(params);

    const signedUrl = await getSignedUrl(r2, command, {
      expiresIn: R2_SIGNED_URL_EXPIRY_TIME,
    }); //in second

    return { status: true, error: null, url: signedUrl };
  } catch (error) {
    return { status: false, error, data: null };
  }
};

export const removeFile = async (filename: string) => {
  try {
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: filename,
    };

    const command = new DeleteObjectCommand(params);
    const info = await r2.send(command);
    return { status: true, error: null, data: info };
  } catch (error) {
    return { status: false, error: error, data: null };
  }
};
