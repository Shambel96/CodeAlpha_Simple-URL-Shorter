import type { Request, Response } from "express";
import {
  createShortUrl,
  findUrlByCode,
  incrementClicks,
} from "../services/url.service.js";
import { AppError } from "../errors/AppError.js";

export async function createUrl(req: Request, res: Response) {
  const { url } = req.body;
  const savedUrl = await createShortUrl(url);
  return res.status(201).json({
    data: savedUrl,
  });
}

export async function redirectUrl(req: Request, res: Response) {
  const { code } = req.params;

  const url = await findUrlByCode(code);

  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  await incrementClicks(url.id);
  return res.redirect(url.originalUrl);
}
