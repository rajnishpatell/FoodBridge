import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["DONOR", "NGO", "ADMIN"],
      required: true,
    },

    trustScore: {
      type: Number,
      default: 0,
    },

    efficiency: {
      type: Number,
      default: 0.8,
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

export default mongoose.model("User", userSchema);