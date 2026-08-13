import { Router } from "express";
import { redirectUrl } from "../controllers/url.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/:code", asyncHandler(redirectUrl));

export default router;
