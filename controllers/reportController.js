import Report from "../models/Report.js";

// Create Report
export const createReport = async (req, res) => {
  try {
    const { description, location, priority } = req.body;

    // Validate required fields
    if (!description || !location || !priority) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Format priority (First letter capital)
    const formattedPriority =
      priority.charAt(0).toUpperCase() +
      priority.slice(1).toLowerCase();

    const report = await Report.create({
      description,
      location,
      priority: formattedPriority,
      media: req.file ? req.file.filename : null, // use filename instead of path
    });

    res.status(201).json({
      success: true,
      message: "Report submitted",
      data: report,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};