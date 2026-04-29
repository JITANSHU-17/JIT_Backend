import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date
});

export default mongoose.model("User", userSchema);
