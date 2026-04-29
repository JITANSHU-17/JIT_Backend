import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      media: req.file ? req.file.filename : null
    });

    res.json({ message: "Report submitted", report });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getReports = async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
};
