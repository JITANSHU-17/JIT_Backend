import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  description: String,
  location: String,
  latitude: Number,
  longitude: Number,
  priority: String,
  media: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Report", reportSchema);
