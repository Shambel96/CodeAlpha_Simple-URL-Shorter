import express from "express";
import { generateCode } from "./utils/generateCode.js";
import { prisma } from "./lib/prisma.js";
const app = express();

const PORT = 3000;
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "URL Shortener API is running",
  });
});

app.post("/api/urls", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "URL is required",
    });
  }

  const shortCode = generateCode();

  const savedUrl = await prisma.url.create({
    data: {
      code: shortCode,
      originalUrl: url,
    },
  });

  return res.status(201).json({
    data: savedUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
