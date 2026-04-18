import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),

    body("email").isEmail().withMessage("Invalid email format"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role").isIn(["DONOR", "NGO", "ADMIN"]).withMessage("Invalid role"),
  ],
  validate,
  registerUser,
);
router.post("/login", loginUser);

export default router;
