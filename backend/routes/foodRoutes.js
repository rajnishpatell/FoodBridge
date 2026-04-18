import express from "express";
import {
  createFood,
  getNearbyFood,
  claimFood,
  markAsCollected
} from "../controllers/foodController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";
import { getMyFood } from "../controllers/foodController.js";
import { deleteFood } from "../controllers/foodController.js";
import { getClaimedFood } from "../controllers/foodController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"),  // ⭐ Image upload
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("foodType")
      .isIn(["VEG", "NON_VEG", "RAW", "DRY"])
      .withMessage("Invalid food type"),
    body("latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    body("longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
  ],
  validate,
  createFood
);

router.get("/nearby", protect, getNearbyFood);

router.put("/claim/:foodId", protect, claimFood);

router.put("/collect/:foodId", protect, markAsCollected);

router.get("/my", protect, getMyFood);

router.delete("/:foodId", protect, deleteFood);

router.get("/claimed", protect, getClaimedFood);

export default router;