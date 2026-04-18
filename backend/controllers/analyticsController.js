import Food from "../models/Food.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

export const getAnalytics = async (req, res) => {
  try {
    const totalFood = await Food.countDocuments();

    const totalCollected = await Food.countDocuments({
      status: "COLLECTED",
    });

    const totalDonors = await User.countDocuments({
      role: "DONOR",
    });

    const totalNGOs = await User.countDocuments({
      role: "NGO",
    });

    const topDonors = await User.find({ role: "DONOR" })
      .sort({ trustScore: -1 })
      .limit(5)
      .select("name trustScore");

    res.json({
      totalFood,
      totalCollected,
      totalDonors,
      totalNGOs,
      topDonors,
    });
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
