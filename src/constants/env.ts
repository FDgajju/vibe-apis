import dotenv from "dotenv";
dotenv.config();

// application
export const PORT: number = Number(process.env.PORT) || 3000;
export const NODE_ENV: string = process.env.NODE_ENV || "dev";
export const BASE_URL = `http://127.0.0.1:${PORT}`;

// database
export const DB_HOST: string =
  process.env.DB_HOST || "mongodb://127.0.0.1:27017";

export const DB: string = process.env.DB || "pollution";
export const DB_PARAMETERS: string = process.env.DB_PARAMETERS || "";

// cloudflare r2 storage
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID as string;
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY as string;
export const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID as string;
export const R2_PUB_ACCOUNT_ID = process.env.R2_PUB_ACCOUNT_ID as string;
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME as string;
export const R2_SIGNED_URL_EXPIRY_TIME = Number.parseInt(
  process.env.R2_SIGNED_URL_EXPIRY_TIME || "300"
);
// export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL as string;

/*
    cors
    add allowed origins options in your env separated by comma
    eg. CORS_ALLOWED_ORIGINS=http://localhost:3000,https://example.com
    */
export const CORS_ALLOWED_ORIGINS =
  process.env.CORS_ALLOWED_ORIGINS?.split(",") ||
  (["http://localhost:3000"] as string[]);

// auth
export const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const DEFAULT_PROFILE_IMAGE = process.env.DEFAULT_PROFILE_IMAGE as string;

export const checkEnv = () => {
  const requiredEnv = [
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_ACCOUNT_ID",
    "R2_PUB_ACCOUNT_ID",
    "R2_BUCKET_NAME",
    // "R2_PUBLIC_URL",
    "DEFAULT_PROFILE_IMAGE",
    "DB_HOST",
    "DB",
  ];

  for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
};

checkEnv()
