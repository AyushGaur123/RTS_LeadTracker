

import express from "express";

import {
  getLeads,
  getLeadById,
  createLead,
  createPublicLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  addNote,
  deleteNote,
  updateFollowUp,
  deleteFollowUp,
  createFollowUp,
  updateFollowUpEntry,
  removeFollowUpEntry,
  getLeadStats,
  getFollowUps,
  getDashboardStats,
  getAdvancedAnalytics,
  bulkImportLeads,
} from "../controllers/leads/index.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/public", createPublicLead);

router.use(protect);

router.get("/follow-ups", getFollowUps);
router.get("/stats", getLeadStats);
router.get("/dashboard", getDashboardStats);
router.get("/advanced", getAdvancedAnalytics);

router.post("/import", upload.single("file"), bulkImportLeads);

router.get("/", getLeads);
router.post("/", createLead);

router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.patch("/:id/status", updateLeadStatus);
router.patch("/:id/follow-up", updateFollowUp);
router.delete("/:id/follow-up",deleteFollowUp);

router.post("/:id/follow-ups", createFollowUp);
router.patch("/:id/follow-ups/:followUpId", updateFollowUpEntry);
router.delete("/:id/follow-ups/:followUpId", removeFollowUpEntry);

router.delete("/:id", deleteLead);

router.post("/:id/notes", addNote);
router.delete("/:id/notes/:noteId", deleteNote);

export default router;