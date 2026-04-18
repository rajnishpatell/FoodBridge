import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// You can restrict to ADMIN later
router.get("/", protect, getAnalytics);

export default router;