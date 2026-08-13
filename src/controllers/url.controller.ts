import type { Request, Response } from "express";
import {
  createShortUrl,
  findUrlByCode,
  incrementClicks,
} from "../services/url.service.js";

export async function createUrl(req: Request, res: Response) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "URL is required",
    });
  }

  const savedUrl = await createShortUrl(url);

  return res.status(201).json({
    data: savedUrl,
  });
}

export async function redirectUrl(req: Request, res: Response) {
  const { code } = req.params;

  const url = await findUrlByCode(code);

  if (!url) {
    return res.status(404).json({
      message: "Short URL not found",
    });
  }

  await incrementClicks(url.id);

  return res.redirect(url.originalUrl);
}
