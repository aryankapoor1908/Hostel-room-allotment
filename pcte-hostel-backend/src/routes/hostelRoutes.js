import { Router } from "express";
import { getAllHostels, createHostel } from "../controllers/hostelController.js";

const router = Router();

router.get("/", getAllHostels);
router.post("/", createHostel);

export default router;
