import { Router } from "express";
import { redirectUrl } from "../controllers/url.controller.js";

const router = Router();

router.get("/:code", redirectUrl);

export default router;
