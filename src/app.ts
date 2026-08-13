import express from "express";
import cors from "cors";
import urlRouter from "./routes/url.routes.js";
import redirectRouter from "./routes/redirect.routes.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "URL Shortener API is running",
  });
});

app.use("/api/urls", urlRouter);
app.use("/", redirectRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
