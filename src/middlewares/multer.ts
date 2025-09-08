import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 } /* max file size is 50 mb*/,
});
