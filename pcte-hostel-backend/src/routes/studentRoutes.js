import { Router } from "express";
import {
  getAllStudents,
  addStudent,
  cycleFeeStatus,
  submitPreferences,
  payFee,
  getReceipts,
  getAllRequests,
  requestRoomChange,
  resolveRequest,
} from "../controllers/studentController.js";

const router = Router();

// Student profiles and status
router.get("/", getAllStudents);
router.post("/", addStudent);
router.patch("/:collegeId/fee-status", cycleFeeStatus);
router.post("/:collegeId/preferences", submitPreferences);

// Fees & Receipts
router.post("/:collegeId/pay", payFee);
router.get("/receipts/all", getReceipts);

// Room change requests
router.get("/requests/all", getAllRequests);
router.post("/requests", requestRoomChange);
router.patch("/requests/:id/resolve", resolveRequest);

export default router;
