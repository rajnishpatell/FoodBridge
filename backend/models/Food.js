import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    quantity: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
    },

    foodType: {
      type: String,
      enum: ["VEG", "NON_VEG", "RAW", "DRY"],
      required: true,
    },

    preparedAt: {
      type: Date,
      required: true,
    },

    temperature: {
      type: Number, // current outside temperature
      required: true,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "CLAIMED", "COLLECTED", "EXPIRED"],
      default: "AVAILABLE",
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true },
);

// 🔥 Needed for geo queries
foodSchema.index({ location: "2dsphere" });

export default mongoose.model("Food", foodSchema);
