import { getPool } from "../../config/db.js";
import Lead, { rowToLead } from "../../models/Lead.js";
import { findCompanyLead } from "./helpers.js";

// PATCH /api/leads/:id/follow-up
export const updateFollowUp = async (req, res) => {
  try {
    const hasFollowUpDate = Object.prototype.hasOwnProperty.call(req.body, "followUpDate");

    if (!hasFollowUpDate) {
      return res.status(400).json({ success: false, message: "followUpDate is required." });
    }

    const { followUpDate } = req.body;
    let parsedDate = null;

    if (followUpDate !== null && followUpDate !== "") {
      parsedDate = new Date(followUpDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid follow-up date." });
      }
    }

    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const updatedLead = await Lead.updateFields(req.params.id, req.user._id, {
      followUpDate: parsedDate,
    });

    res.status(200).json({
      success: true,
      message: parsedDate ? "Follow-up saved successfully." : "Follow-up deleted successfully.",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("UPDATE FOLLOW-UP ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/leads/:id/follow-up
export const deleteFollowUp = async (req, res) => {
  try {
    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    if (!result.lead.followUpDate) {
      return res.status(400).json({
        success: false,
        message: "No follow-up is scheduled for this lead.",
      });
    }

    const updatedLead = await Lead.updateFields(req.params.id, req.user._id, {
      followUpDate: null,
    });

    res.status(200).json({ success: true, message: "Follow-up deleted successfully.", lead: updatedLead });
  } catch (error) {
    console.error("DELETE FOLLOW-UP ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/leads/:id/follow-ups
export const createFollowUp = async (req, res) => {
  try {
    const { dueDate, note } = req.body;

    if (!dueDate) {
      return res.status(400).json({ success: false, message: "A follow-up date is required." });
    }

    const parsedDate = new Date(dueDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid follow-up date." });
    }

    const result = await findCompanyLead(req.params.id, req.user._id);
    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const updatedLead = await Lead.addFollowUp(
      req.params.id,
      req.user._id,
      parsedDate,
      note?.trim(),
      req.user._id
    );

    res.status(201).json({ success: true, message: "Follow-up scheduled successfully.", lead: updatedLead });
  } catch (error) {
    console.error("CREATE FOLLOW-UP ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/leads/:id/follow-ups/:followUpId
export const updateFollowUpEntry = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "done"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'pending' or 'done'." });
    }

    const result = await findCompanyLead(req.params.id, req.user._id);
    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const outcome = await Lead.updateFollowUpStatus(req.params.id, req.params.followUpId, req.user._id, status);

    if (outcome.status) {
      return res.status(outcome.status).json({ success: false, message: outcome.message });
    }

    res.json({ success: true, message: "Follow-up updated successfully.", lead: outcome.lead });
  } catch (error) {
    console.error("UPDATE FOLLOW-UP ENTRY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/leads/:id/follow-ups/:followUpId
export const removeFollowUpEntry = async (req, res) => {
  try {
    const result = await findCompanyLead(req.params.id, req.user._id);
    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const outcome = await Lead.deleteFollowUpEntry(req.params.id, req.params.followUpId, req.user._id);

    if (outcome.status) {
      return res.status(outcome.status).json({ success: false, message: outcome.message });
    }

    res.json({ success: true, message: "Follow-up deleted successfully.", lead: outcome.lead });
  } catch (error) {
    console.error("DELETE FOLLOW-UP ENTRY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leads/follow-ups
export const getFollowUps = async (req, res) => {
  try {
    const pool = getPool();
    const companyId = req.user._id;

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const [rows] = await pool.query(
      `SELECT id, name, email, company, status, follow_up_date, created_at
       FROM leads
       WHERE company_id = ? AND follow_up_date IS NOT NULL
       ORDER BY follow_up_date ASC`,
      [companyId]
    );

    const all = rows.map((row) => rowToLead(row));

    const overdue = all.filter((lead) => new Date(lead.followUpDate) < startOfToday);
    const today = all.filter(
      (lead) => new Date(lead.followUpDate) >= startOfToday && new Date(lead.followUpDate) <= endOfToday
    );
    const upcoming = all.filter((lead) => new Date(lead.followUpDate) > endOfToday);

    res.status(200).json({ success: true, all, overdue, today, upcoming });
  } catch (error) {
    console.error("GET FOLLOW-UPS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
