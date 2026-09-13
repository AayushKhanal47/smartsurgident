import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

interface MongoLikeError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: MongoLikeError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  // These three only trigger for *uncaught* Mongoose/MongoDB errors — every
  // controller that already does `res.status(4xx); throw new Error("...")`
  // is untouched, since a plain Error never has `.code`/`.errors` set.
  // Previously these leaked raw driver text (e.g. index/field names) to the
  // client as a generic 500 (security audit finding L-8).
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0];
    message = field ? `${field} is already in use` : "Duplicate value";
  } else if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ") || "Validation failed";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
