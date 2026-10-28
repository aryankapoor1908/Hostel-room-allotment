import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB, isMongoConnected } from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import hostelRoutes from "./src/routes/hostelRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import outpassRoutes from "./src/routes/outpassRoutes.js";
import complaintRoutes from "./src/routes/complaintRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import messRoutes from "./src/routes/messRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import marketplaceRoutes from "./src/routes/marketplaceRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";

import { notFoundHandler, errorHandler } from "./src/middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with graceful fallback to local persistent store if offline)
connectDB();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "PCTE Hostel Management API",
    version: "1.0.0",
    mongoConnected: isMongoConnected(),
    storageEngine: isMongoConnected() ? "MongoDB" : "Embedded Local Persistent Store",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/outpasses", outpassRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/inventory", inventoryRoutes);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 PCTE Hostel API Server listening on port \x1b[36m${PORT}\x1b[0m`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});
