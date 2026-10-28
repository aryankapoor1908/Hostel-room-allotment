import { Router } from "express";
import { login, getMe, register } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticateToken, getMe);

export default router;
