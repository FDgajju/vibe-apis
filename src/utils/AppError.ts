import type { AnyType } from "../types/globalTypes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: AnyType;
  public readonly status?: boolean;

  constructor(error: AnyType, statusCode?: number) {
    super(typeof error === "object" && error !== null ? error.message : error);

    if (typeof error === "object" && error !== null) {
      this.name = error.name || "Error";
      this.code = error.code;
      this.details = { ...error };
    } else {
      this.name = "ApiError";
      this.details = error;
    }

    this.status = false;
    this.statusCode = statusCode || 500;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
