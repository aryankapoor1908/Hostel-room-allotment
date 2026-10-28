import { Router } from "express";
import {
  getAllComplaints,
  createComplaint,
  assignComplaint,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

const router = Router();

router.get("/", getAllComplaints);
router.post("/", createComplaint);
router.patch("/:id/assign", assignComplaint);
router.patch("/:id/status", updateComplaintStatus);

export default router;
