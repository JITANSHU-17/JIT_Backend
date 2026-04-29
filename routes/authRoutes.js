import express from "express";
import { signup, login, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-signup-otp", verifyOtp);

export default router;
