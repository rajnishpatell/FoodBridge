import Food from "../models/Food.js";
import User from "../models/User.js";
import { calculateRiskScore } from "../utils/aiScoring.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import axios from "axios";

// Create Food Listing
export const createFood = async (req, res) => {
  try {
    const {
      title,
      description,
      quantity,
      foodType,
      preparedAt,
      latitude,
      longitude,
    } = req.body;

    // Only DONOR can create listing
    if (req.user.role !== "DONOR") {
      return res
        .status(403)
        .json({ message: "Only donors can create food listings" });
    }

    // Fetch current temperature using Open-Meteo
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params: {
          latitude,
          longitude,
          current: "temperature_2m",
        },
      },
    );

    const temperature = weatherResponse.data?.current?.temperature_2m ?? 25;

    // Calculate AI Risk Score
    const riskScore = calculateRiskScore(foodType, preparedAt, temperature);

    // Upload image to Cloudinary
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foodbridge",
      });

      imageUrl = result.secure_url;
    }

    // Create food entry
    const food = await Food.create({
      donor: req.user._id,
      title,
      description,
      quantity,
      foodType,
      preparedAt,
      temperature,
      riskScore,

      image: imageUrl, // ⭐ Cloudinary image URL

      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    logger.info(`Food created by donor ${req.user._id}`);

    // Real-time notification
    global.io.emit("newFood", {
      id: food._id,
      title: food.title,
      quantity: food.quantity,
      latitude,
      longitude,
    });

    res.status(201).json(food);
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Nearby Food (NGO)
export const getNearbyFood = async (req, res) => {
  try {
    if (req.user.role !== "NGO") {
      return res
        .status(403)
        .json({ message: "Only NGOs can view nearby food" });
    }

    const { latitude, longitude } = req.query;

    // 🔥 GEO QUERY WITH DISTANCE
    const foodList = await Food.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance", // meters
          maxDistance: 50000, // 50km (increase/decrease as needed)
          spherical: true,
          query: { status: "AVAILABLE" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "donor",
          foreignField: "_id",
          as: "donor",
        },
      },
      {
        $unwind: "$donor",
      },
    ]);

    // 🔥 Add scoring + convert distance
    const rankedFood = foodList.map((food) => {
      const distanceKm = (food.distance / 1000).toFixed(2);

      const urgencyScore = food.riskScore;
      const donorTrust = food.donor.trustScore || 0;

      const finalScore =
        0.4 * urgencyScore +
        0.3 * (1 / (parseFloat(distanceKm) + 1)) + // closer = higher score
        0.2 * donorTrust +
        0.1 * 0.8;

      return {
        ...food,
        distanceKm,
        finalScore,
      };
    });

    // 🔥 Sort by score (smart ranking)
    rankedFood.sort((a, b) => b.finalScore - a.finalScore);

    res.json({
      results: rankedFood,
    });
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Claim Food
export const claimFood = async (req, res) => {
  try {
    if (req.user.role !== "NGO") {
      return res.status(403).json({ message: "Only NGOs can claim food" });
    }

    const { foodId } = req.params;

    const food = await Food.findOneAndUpdate(
      { _id: foodId, status: "AVAILABLE" },
      {
        status: "CLAIMED",
        claimedBy: req.user._id,
      },
      { new: true },
    );

    // AFTER food is updated

    if (!food) {
      return res.status(400).json({ message: "Food already claimed" });
    }

    global.io.emit("foodClaimed", {
      foodId: food._id,
      status: "CLAIMED",
    });

    logger.info(`Food ${foodId} claimed by NGO ${req.user._id}`);

    res.json({ message: "Food claimed successfully", food });
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark Food as Collected
export const markAsCollected = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (
      req.user.role !== "NGO" ||
      food.claimedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    food.status = "COLLECTED";
    await food.save();

    logger.info(`Food ${foodId} marked as collected`);

    await User.findByIdAndUpdate(food.donor, {
      $inc: { trustScore: 0.1 },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { efficiency: 0.05 },
    });

    res.json({ message: "Food marked as collected" });
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Listings (DONOR)
export const getMyFood = async (req, res) => {
  try {
    // Only donor allowed
    if (req.user.role !== "DONOR") {
      return res.status(403).json({
        message: "Only donors can view their listings",
      });
    }

    const foods = await Food.find({
      donor: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Food (DONOR)
export const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Only owner donor can delete
    if (
      req.user.role !== "DONOR" ||
      food.donor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await food.deleteOne();

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Claimed Food (NGO)
export const getClaimedFood = async (req, res) => {
  try {
    // Only NGO allowed
    if (req.user.role !== "NGO") {
      return res.status(403).json({
        message: "Only NGOs can view claimed food",
      });
    }

    const foods = await Food.find({
      claimedBy: req.user._id,
    })
      .populate("donor", "name") // 🔥 show donor name
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    logger.error(error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
