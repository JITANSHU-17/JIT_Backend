import express from "express";
import { createReport, getReports } from "../controllers/reportController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("media"), createReport);
router.get("/", getReports);

export default router;
