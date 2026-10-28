import { Router } from "express";
import {
  getMessMenu,
  updateMessMenu,
  getMealSkips,
  toggleMealSkip,
} from "../controllers/messController.js";

const router = Router();

router.get("/menu", getMessMenu);
router.put("/menu", updateMessMenu);
router.get("/skips/:collegeId", getMealSkips);
router.post("/skips/toggle", toggleMealSkip);

export default router;
