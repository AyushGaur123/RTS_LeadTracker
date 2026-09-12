import express from "express";

import {
  registerAdmin,
  loginAdmin,
  getMe,
  getCompanies,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/me", protect, getMe);

router.get(
  "/companies",
  getCompanies
);

export default router;