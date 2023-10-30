require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookiesParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRoute from "./routes/notification.route";
import analyticRoute from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import rateLimit from "express-rate-limit";

// body parser
app.use(express.json({ limit: "50mb" }));

// Cookies parser
app.use(cookiesParser());

// cors => cross origin resource sharing
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})


// routes
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRoute, analyticRoute, layoutRouter);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "api is working",
  });
});

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(limiter)

app.use(ErrorMiddleware);
