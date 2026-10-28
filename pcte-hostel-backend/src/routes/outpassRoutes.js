import { Router } from "express";
import {
  getAllOutpasses,
  createOutpass,
  resolveOutpass,
  checkInOutpass,
} from "../controllers/outpassController.js";

const router = Router();

router.get("/", getAllOutpasses);
router.post("/", createOutpass);
router.patch("/:id/resolve", resolveOutpass);
router.patch("/:id/checkin", checkInOutpass);

export default router;
