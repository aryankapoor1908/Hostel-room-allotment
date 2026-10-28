import { Router } from "express";
import {
  getAttendance,
  markAttendance,
  bulkMarkAttendance,
} from "../controllers/attendanceController.js";

const router = Router();

router.get("/", getAttendance);
router.post("/mark", markAttendance);
router.post("/bulk", bulkMarkAttendance);

export default router;
