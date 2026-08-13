import { Router } from "express";
import { createUrl } from "../controllers/url.controller.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createUrlSchema } from "../validators/url.validator.js";

const router = Router();

router.post("/", validate(createUrlSchema), asyncHandler(createUrl));

export default router;
