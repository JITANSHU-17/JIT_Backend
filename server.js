import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is alive");
});

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 5 })
.then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log("Server running")
  );
})
.catch(err => console.log(err));
