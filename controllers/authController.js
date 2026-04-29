import User from "../models/User.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { encrypt, hash } from "../config/Encryption.js";
import { sendOtp } from "../utils/sendOtp.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const hash_email = hash(email);
    const existing = await User.findOne({ hash_email });

    if (existing) {
      return res.status(400).json({ message: "User exists" });
    }

    const enc_email = encrypt(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      enc_email,
      hash_email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false
    });

    res.json({ message: "OTP sent" });

    setImmediate(() => {
      sendOtp(email, otp).catch(console.error);
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const hash_email = hash(email);
    const user = await User.findOne({ hash_email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "Verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hash_email = hash(email);
    const user = await User.findOne({ hash_email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};