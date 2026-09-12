import { getPool } from "../../config/db.js";
import { LEAD_STATUSES } from "./constants.js";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// GET /api/leads/stats
export const getLeadStats = async (req, res) => {
  try {
    const pool = getPool();
    const companyId = req.user._id;

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM leads WHERE company_id = ?",
      [companyId]
    );

    const [statusRows] = await pool.query(
      "SELECT status AS _id, COUNT(*) AS count FROM leads WHERE company_id = ? GROUP BY status",
      [companyId]
    );

    const stats = {};
    LEAD_STATUSES.forEach((status) => {
      const found = statusRows.find((item) => item._id === status);
      stats[status] = found ? Number(found.count) : 0;
    });

    const converted = stats.won || 0;
    const conversionRate = total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0;

    const [sources] = await pool.query(
      `SELECT source AS _id, COUNT(*) AS count
       FROM leads WHERE company_id = ?
       GROUP BY source ORDER BY count DESC`,
      [companyId]
    );

    res.status(200).json({
      success: true,
      stats: { total: Number(total), ...stats, converted, conversionRate },
      sources: sources.map((s) => ({ _id: s._id, count: Number(s.count) })),
    });
  } catch (error) {
    console.error("GET LEAD STATS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lead statistics" });
  }
};

// GET /api/leads/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const pool = getPool();
    const companyId = req.user._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const [[{ newLeads }]] = await pool.query(
      `SELECT COUNT(*) AS newLeads FROM leads
       WHERE company_id = ? AND status = 'new' AND created_at >= ? AND created_at < ?`,
      [companyId, sevenDaysAgo, endOfToday]
    );

    const [[{ wonLeads }]] = await pool.query(
      `SELECT COUNT(*) AS wonLeads FROM leads
       WHERE company_id = ? AND status = 'won' AND won_at >= ? AND won_at < ?`,
      [companyId, sevenDaysAgo, endOfToday]
    );

    const [[{ lostLeads }]] = await pool.query(
      `SELECT COUNT(*) AS lostLeads FROM leads
       WHERE company_id = ? AND status = 'lost' AND lost_at >= ? AND lost_at < ?`,
      [companyId, sevenDaysAgo, endOfToday]
    );

    const conversionTrend = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(startOfToday);
      date.setDate(startOfToday.getDate() - i);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const [[{ won }]] = await pool.query(
        `SELECT COUNT(*) AS won FROM leads
         WHERE company_id = ? AND status = 'won' AND won_at >= ? AND won_at < ?`,
        [companyId, date, nextDate]
      );

      const [[{ lost }]] = await pool.query(
        `SELECT COUNT(*) AS lost FROM leads
         WHERE company_id = ? AND status = 'lost' AND lost_at >= ? AND lost_at < ?`,
        [companyId, date, nextDate]
      );

      conversionTrend.push({ date: formatDate(date), won: Number(won), lost: Number(lost) });
    }

    res.status(200).json({
      success: true,
      stats: { new: Number(newLeads), won: Number(wonLeads), lost: Number(lostLeads) },
      conversionTrend,
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics" });
  }
};

// GET /api/leads/advanced
export const getAdvancedAnalytics = async (req, res) => {
  try {
    const pool = getPool();
    const companyId = req.user._id;

    const [sourceConversion] = await pool.query(
      `SELECT
         source,
         SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS won,
         SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) AS lost
       FROM leads
       WHERE company_id = ?
       GROUP BY source
       ORDER BY won DESC`,
      [companyId]
    );

    const [lostReasons] = await pool.query(
      `SELECT lost_reason AS reason, COUNT(*) AS count
       FROM leads
       WHERE company_id = ? AND status = 'lost'
       GROUP BY lost_reason
       ORDER BY count DESC`,
      [companyId]
    );

    res.json({
      success: true,
      sourceConversion: sourceConversion.map((row) => ({
        source: row.source,
        won: Number(row.won),
        lost: Number(row.lost),
      })),
      lostReasons: lostReasons.map((row) => ({
        reason: row.reason,
        count: Number(row.count),
      })),
    });
  } catch (error) {
    console.error("ADVANCED ANALYTICS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};
