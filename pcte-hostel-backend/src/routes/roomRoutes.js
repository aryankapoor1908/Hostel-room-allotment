import { Router } from "express";
import { getAllRooms, flagMaintenance, runAllotment } from "../controllers/roomController.js";

const router = Router();

router.get("/", getAllRooms);
router.post("/allotment/run", runAllotment);
router.patch("/:roomNumber/maintenance", flagMaintenance);

export default router;
