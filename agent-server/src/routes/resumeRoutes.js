import express from "express";
import { parseResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/parse-resume", parseResume);

export default router;
