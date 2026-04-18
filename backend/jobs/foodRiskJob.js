import cron from "node-cron";
import Food from "../models/Food.js";
import { calculateRiskScore } from "../utils/aiScoring.js";
import logger from "../utils/logger.js";

const startFoodRiskJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    logger.info("Running automated food risk update...");

    try {
      const foods = await Food.find({ status: "AVAILABLE" });

      for (let food of foods) {
        const newRisk = calculateRiskScore(
          food.foodType,
          food.preparedAt,
          food.temperature
        );

        food.riskScore = newRisk;

        if (newRisk >= 1) {
          food.status = "EXPIRED";
        }

        await food.save();
      }

      logger.info("Food risk update completed");
    } catch (error) {
      console.error("Error in food risk cron job:", error);
    }
  });
};

export default startFoodRiskJob;