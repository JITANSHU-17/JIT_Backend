import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new Schema({
  // Encrypted email (for storage)
  enc_email: {
    type: String,
    required: true,
    unique: true,
  },

  // Hash of email (for lookup/search)
  hash_email: {
    type: String,
    required: true,
    index: true,
  },

  // Password (hashed before save)
  password: {
    type: String,
    required: true,
  },

  // Verification status
  isVerified: {
    type: Boolean,
    default: false,
  },

  // OTP system
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

/* ================= PASSWORD HASH ================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ================= PASSWORD CHECK ================= */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ================= EMAIL HELPERS ================= */

// Hash email (for search)
userSchema.statics.hashEmail = function (email) {
  return crypto.createHash("sha256").update(email).digest("hex");
};

// Encrypt email (basic example)
userSchema.statics.encryptEmail = function (email) {
  const cipher = crypto.createCipher("aes-256-cbc", process.env.EMAIL_SECRET);
  let encrypted = cipher.update(email, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

/* ================= OTP METHODS ================= */

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.otp = otp;
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (enteredOTP) {
  return (
    this.otp === enteredOTP &&
    this.otpExpires > Date.now()
  );
};

const User = mongoose.model("User", userSchema);
export default User;