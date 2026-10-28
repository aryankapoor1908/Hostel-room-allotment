import { Router } from "express";
import {
  getMarketplaceItems,
  createMarketplaceItem,
  deleteMarketplaceItem,
} from "../controllers/marketplaceController.js";

const router = Router();

router.get("/", getMarketplaceItems);
router.post("/", createMarketplaceItem);
router.delete("/:id", deleteMarketplaceItem);

export default router;
