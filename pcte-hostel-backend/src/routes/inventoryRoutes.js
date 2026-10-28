import { Router } from "express";
import {
  getInventoryChecklist,
  verifyInventoryItem,
} from "../controllers/inventoryController.js";

const router = Router();

router.get("/", getInventoryChecklist);
router.patch("/:id/verify", verifyInventoryItem);

export default router;
