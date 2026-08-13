import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return res.status(409).json({
      message: "A resource with the same value already exists",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};
