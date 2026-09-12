import Lead from "../../models/Lead.js";
import { findCompanyLead } from "./helpers.js";
import { LEAD_STATUSES } from "./constants.js";

// PATCH /api/leads/:id/status
export const updateLeadStatus = async (req, res) => {
  try {
    const { status, lostReason } = req.body;

    if (!LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid lead status." });
    }

    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const updates = { status };

    if (status === "contacted") updates.lastContactedAt = new Date();
    if (status === "won") updates.wonAt = new Date();

    if (status === "lost") {
      if (!lostReason) {
        return res.status(400).json({ success: false, message: "Lost reason is required." });
      }

      updates.lostReason = lostReason;
      updates.lostAt = new Date();
    } else {
      updates.lostReason = null;
    }

    const updatedLead = await Lead.updateFields(req.params.id, req.user._id, updates);

    res.json({ success: true, message: "Lead status updated.", lead: updatedLead });
  } catch (error) {
    console.error("UPDATE LEAD STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
