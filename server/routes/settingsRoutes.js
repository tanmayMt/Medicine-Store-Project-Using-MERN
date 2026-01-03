import express from "express";
import {
  getSettingsController,
  updateSettingsController,
  getUpiSettingsController,
} from "../controllers/settingsController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get settings (Admin only)
router.get("/get-settings", requireSignIn, isAdmin, getSettingsController);

// Update settings (Admin only)
router.put("/update-settings", requireSignIn, isAdmin, updateSettingsController);

// Get UPI settings (Public - for cart page)
router.get("/upi-settings", getUpiSettingsController);

export default router;

