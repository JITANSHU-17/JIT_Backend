import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  media: {
    type: String, // image/video URL or file path
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: index for geo queries (future-proofing)
reportSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.model("Report", reportSchema);