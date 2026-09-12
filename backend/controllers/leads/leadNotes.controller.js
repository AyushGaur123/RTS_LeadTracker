import Lead from "../../models/Lead.js";
import { findCompanyLead } from "./helpers.js";

// POST /api/leads/:id/notes
export const addNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Note cannot be empty." });
    }

    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const updatedLead = await Lead.addNote(req.params.id, req.user._id, text.trim(), req.user._id);

    res.status(201).json({ success: true, message: "Note added successfully.", lead: updatedLead });
  } catch (error) {
    console.error("ADD NOTE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/leads/:id/notes/:noteId
export const deleteNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;

    const result = await findCompanyLead(id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const outcome = await Lead.deleteNote(id, noteId, req.user._id);

    if (outcome.status) {
      return res.status(outcome.status).json({ success: false, message: outcome.message });
    }

    res.json({ success: true, message: "Note deleted successfully.", lead: outcome.lead });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
