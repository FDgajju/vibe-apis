import winston from "winston";
import type { AnyType } from "../types/globalTypes";

// Define log levels and their colors
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

// Apply colors to winston
winston.addColors(logLevels.colors);

// Define log formats
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const statusCode = meta.statusCode
      ? ` | statusCode: ${meta.statusCode}`
      : "";
    return `${timestamp} ${level}: ${message}${statusCode}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format((info, opts) => {
    const sensitiveFields = [
      "password",
      "passwordConfirm",
      "newPassword",
      "oldPassword",
    ];
    if (info.body) {
      const body = { ...info.body } as AnyType;
      sensitiveFields.forEach((field) => {
        if (body[field]) {
          body[field] = "[REDACTED]";
        }
      });
      info.body = body;
    }
    if (info.query) {
      const query = { ...info.query } as AnyType;
      sensitiveFields.forEach((field) => {
        if (query[field]) {
          query[field] = "[REDACTED]";
        }
      });
      info.query = query;
    }
    if (info.params) {
      const params = { ...info.params } as AnyType;
      sensitiveFields.forEach((field) => {
        if (params[field]) {
          params[field] = "[REDACTED]";
        }
      });
      info.params = params;
    }
    return info;
  })(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const statusCode = meta.statusCode
      ? ` | statusCode: ${meta.statusCode}`
      : "";
    const logData = JSON.stringify({
      body: meta.body,
      params: meta.params,
      query: meta.query,
    });
    return `${timestamp} ${level}: ${message}${statusCode} | log_data: ${logData}`;
  })
);

// Function to format the date with leading zeros (optional)
function pad(number: number) {
  return number.toString().padStart(2, "0");
}

// Extract year, month, and day with leading zeros

const getFileName = (today: Date) => {
  const year = pad(today.getFullYear());
  const month = pad(today.getMonth() + 1); // Month is zero-indexed
  const day = pad(today.getDate());

  // Combine year, month, and day into filename
  return `${year}-${month}-${day}.log`;
};

// Create a Winston logger
export const logger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      level: "http", // Ensure all levels from 'http' and above are logged
    }),
    new winston.transports.File({
      filename: `.log/${getFileName(new Date())}`,
      format: fileFormat,
      level: "http", // Ensure all levels from 'http' and above are logged
    }),
  ],
});
