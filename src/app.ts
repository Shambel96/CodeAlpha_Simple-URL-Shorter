import express from "express";

import urlRouter from "./routes/url.routes.js";
import redirectRouter from "./routes/redirect.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "URL Shortener API is running",
  });
});

app.use("/api/urls", urlRouter);

app.use("/", redirectRouter);

export default app;
