import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "External server error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found , Invalid: ${Object.keys(
      err.ketValue
    )}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.ketValue)}`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  //Jwt expire error
  if (err.name === "TokenExpireError") {
    const message = `Json Web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
