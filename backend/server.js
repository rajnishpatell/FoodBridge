import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

import startFoodRiskJob from "./jobs/foodRiskJob.js";

import http from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();

/* ---------------- Security Middlewares ---------------- */

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use(limiter);

/* ---------------- Basic Middlewares ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- Cron Job ---------------- */

startFoodRiskJob();

/* ---------------- Routes ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("FoodBridge API Running 🚀");
});

/* ---------------- Socket.io Setup ---------------- */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/* Make io available globally */

global.io = io;

io.on("connection", (socket) => {

  logger.info(`Client connected`);

  socket.on("disconnect", () => {
    logger.info(`Client disconnected`);
  });

});

/* ---------------- Start Server ---------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});