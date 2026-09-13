import { getPool } from "../config/db.js";


export const LEAD_COLUMN_MAP = {
  name: "name",
  email: "email",
  phone: "phone",
  company: "company",
  message: "message",

  website: "website",
  address: "address",
  websiteStatus: "website_status",
  https: "https",
  mobileResponsive: "mobile_responsive",
  pageSpeed: "page_speed",
  outdatedIndicators: "outdated_indicators",
  leadScore: "lead_score",

  googleRating: "google_rating",
  googleReviewCount: "google_review_count",
  googleReviewsUrl: "google_reviews_url",
  googleMapsUrl: "google_maps_url",

  facebook: "facebook",
  instagram: "instagram",
  linkedin: "linkedin",
  youtube: "youtube",
  socialMediaFound: "social_media_found",
  socialMediaLinks: "social_media_links",

  emailCount: "email_count",
  emailSource: "email_source",
  emailType: "email_type",
  allEmails: "all_emails",

  source: "source",
  status: "status",

  followUpDate: "follow_up_date",
  lastContactedAt: "last_contacted_at",
  wonAt: "won_at",
  lostAt: "lost_at",
  lostReason: "lost_reason",

  importedFrom: "imported_from",
  imageUrl: "image_url",
  topComments: "top_comments",

  companyId: "company_id",
};

export const rowToLead = (row, notes = [], followUps = []) => {
  if (!row) return null;

  return {
    id: row.id,
    _id: row.id,
    companyId: row.company_id,

    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    message: row.message,

    website: row.website,
    address: row.address,
    websiteStatus: row.website_status,
    https: row.https,
    mobileResponsive: row.mobile_responsive,
    pageSpeed: row.page_speed,
    outdatedIndicators: row.outdated_indicators,
    leadScore: row.lead_score === null ? null : Number(row.lead_score),

    googleRating: row.google_rating === null ? null : Number(row.google_rating),
    googleReviewCount: row.google_review_count,
    googleReviewsUrl: row.google_reviews_url,
    googleMapsUrl: row.google_maps_url,

    facebook: row.facebook,
    instagram: row.instagram,
    linkedin: row.linkedin,
    youtube: row.youtube,
    socialMediaFound: row.social_media_found,
    socialMediaLinks: row.social_media_links,

    emailCount: row.email_count,
    emailSource: row.email_source,
    emailType: row.email_type,
    allEmails: row.all_emails,

    source: row.source,
    status: row.status,

    followUpDate: row.follow_up_date,
    lastContactedAt: row.last_contacted_at,
    wonAt: row.won_at,
    lostAt: row.lost_at,
    lostReason: row.lost_reason,

    importedFrom: row.imported_from,
    imageUrl: row.image_url,
    topComments: row.top_comments,

    createdAt: row.created_at,
    updatedAt: row.updated_at,

    notes: notes.map(rowToNote),
    followUps: followUps.map(rowToFollowUp),
  };
};

const rowToNote = (row) => ({
  id: row.id,
  _id: row.id,
  text: row.text,
  createdBy: row.created_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const rowToFollowUp = (row) => ({
  id: row.id,
  _id: row.id,
  dueDate: row.due_date,
  note: row.note,
  status: row.status,
  createdBy: row.created_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getNotesForLead = async (leadId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at ASC",
    [leadId]
  );
  return rows;
};

const getFollowUpsForLead = async (leadId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM lead_follow_ups WHERE lead_id = ? ORDER BY due_date ASC",
    [leadId]
  );
  return rows;
};

// GET /api/leads (with search/status/source/sort filters)
const findAll = async ({ companyId, search, status, source, sort = "newest" }) => {
  const pool = getPool();

  const where = ["company_id = ?"];
  const params = [companyId];

  if (search) {
    where.push("(name LIKE ? OR email LIKE ? OR company LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (status && status !== "all") {
    where.push("status = ?");
    params.push(status);
  }

  if (source && source !== "all") {
    where.push("source = ?");
    params.push(source);
  }

  const orderBy = sort === "oldest" ? "created_at ASC" : "created_at DESC";

  const [rows] = await pool.query(
    `SELECT * FROM leads WHERE ${where.join(" AND ")} ORDER BY ${orderBy}`,
    params
  );

  return rows.map((row) => rowToLead(row));
};

const findByIdAndCompany = async (id, companyId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM leads WHERE id = ? AND company_id = ? LIMIT 1",
    [id, companyId]
  );

  if (!rows[0]) return null;

  const [notes, followUps] = await Promise.all([
    getNotesForLead(id),
    getFollowUpsForLead(id),
  ]);
  return rowToLead(rows[0], notes, followUps);
};

const buildInsertFromData = (data) => {
  const columns = [];
  const placeholders = [];
  const values = [];

  for (const [camelKey, column] of Object.entries(LEAD_COLUMN_MAP)) {
    if (data[camelKey] === undefined) continue;
    columns.push(column);
    placeholders.push("?");
    values.push(data[camelKey] === "" ? null : data[camelKey]);
  }

  return { columns, placeholders, values };
};

const create = async (data) => {
  const pool = getPool();
  const { columns, placeholders, values } = buildInsertFromData(data);

  const [result] = await pool.query(
    `INSERT INTO leads (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
    values
  );

  return findByIdAndCompany(result.insertId, data.companyId);
};

const updateFields = async (id, companyId, updates) => {
  const pool = getPool();

  const setClauses = [];
  const values = [];

  for (const [camelKey, column] of Object.entries(LEAD_COLUMN_MAP)) {
    if (updates[camelKey] === undefined) continue;
    setClauses.push(`${column} = ?`);
    values.push(updates[camelKey] === "" ? null : updates[camelKey]);
  }

  if (!setClauses.length) {
    return findByIdAndCompany(id, companyId);
  }

  values.push(id, companyId);

  await pool.query(
    `UPDATE leads SET ${setClauses.join(", ")} WHERE id = ? AND company_id = ?`,
    values
  );

  return findByIdAndCompany(id, companyId);
};

const remove = async (id, companyId) => {
  const pool = getPool();
  const [result] = await pool.query(
    "DELETE FROM leads WHERE id = ? AND company_id = ?",
    [id, companyId]
  );
  return result.affectedRows > 0;
};

const addNote = async (leadId, companyId, text, createdBy) => {
  const pool = getPool();

  const [leadRows] = await pool.query(
    "SELECT id FROM leads WHERE id = ? AND company_id = ? LIMIT 1",
    [leadId, companyId]
  );
  if (!leadRows[0]) return null;

  await pool.query(
    "INSERT INTO lead_notes (lead_id, text, created_by) VALUES (?, ?, ?)",
    [leadId, text, createdBy || null]
  );

  return findByIdAndCompany(leadId, companyId);
};

const deleteNote = async (leadId, noteId, companyId) => {
  const pool = getPool();

  const [leadRows] = await pool.query(
    "SELECT id FROM leads WHERE id = ? AND company_id = ? LIMIT 1",
    [leadId, companyId]
  );
  if (!leadRows[0]) return { status: 404, message: "Lead not found." };

  const [result] = await pool.query(
    "DELETE FROM lead_notes WHERE id = ? AND lead_id = ?",
    [noteId, leadId]
  );

  if (result.affectedRows === 0) {
    return { status: 404, message: "Note not found." };
  }

  const lead = await findByIdAndCompany(leadId, companyId);
  return { lead };
};

// Keeps leads.follow_up_date pointing at the earliest *pending*
// follow-up, so existing dashboard widgets/sorting that rely on that
// single column keep working unchanged even though a lead can now
// have many follow-ups.
const syncNextFollowUpDate = async (leadId, companyId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT due_date FROM lead_follow_ups
     WHERE lead_id = ? AND status = 'pending'
     ORDER BY due_date ASC LIMIT 1`,
    [leadId]
  );

  const nextDate = rows[0] ? rows[0].due_date : null;

  await pool.query(
    "UPDATE leads SET follow_up_date = ? WHERE id = ? AND company_id = ?",
    [nextDate, leadId, companyId]
  );
};

const addFollowUp = async (leadId, companyId, dueDate, note, createdBy) => {
  const pool = getPool();

  const [leadRows] = await pool.query(
    "SELECT id FROM leads WHERE id = ? AND company_id = ? LIMIT 1",
    [leadId, companyId]
  );
  if (!leadRows[0]) return null;

  await pool.query(
    "INSERT INTO lead_follow_ups (lead_id, due_date, note, created_by) VALUES (?, ?, ?, ?)",
    [leadId, dueDate, note || null, createdBy || null]
  );

  await syncNextFollowUpDate(leadId, companyId);
  return findByIdAndCompany(leadId, companyId);
};

const updateFollowUpStatus = async (leadId, followUpId, companyId, status) => {
  const pool = getPool();

  const [leadRows] = await pool.query(
    "SELECT id FROM leads WHERE id = ? AND company_id = ? LIMIT 1",
    [leadId, companyId]
  );
  if (!leadRows[0]) return { status: 404, message: "Lead not found." };

  const [result] = await pool.query(
    "UPDATE lead_follow_ups SET status = ? WHERE id = ? AND lead_id = ?",
    [status, followUpId, leadId]
  );

  if (result.affectedRows === 0) {
    return { status: 404, message: "Follow-up not found." };
  }

  await syncNextFollowUpDate(leadId, companyId);
  const lead = await findByIdAndCompany(leadId, companyId);
  return { lead };
};

const deleteFollowUpEntry = async (leadId, followUpId, companyId) => {
  const pool = getPool();

  const [leadRows] = await pool.query(
    "SELECT id FROM leads WHERE id = ? AND company_id = ? LIMIT 1",
    [leadId, companyId]
  );
  if (!leadRows[0]) return { status: 404, message: "Lead not found." };

  const [result] = await pool.query(
    "DELETE FROM lead_follow_ups WHERE id = ? AND lead_id = ?",
    [followUpId, leadId]
  );

  if (result.affectedRows === 0) {
    return { status: 404, message: "Follow-up not found." };
  }

  await syncNextFollowUpDate(leadId, companyId);
  const lead = await findByIdAndCompany(leadId, companyId);
  return { lead };
};

// Bulk-inserts many leads (used by the spreadsheet importer) in one
// multi-row INSERT for speed. Returns the number of rows inserted.
const bulkInsert = async (rowsOfData) => {
  if (!rowsOfData.length) return 0;

  const pool = getPool();
  const camelKeys = Object.keys(LEAD_COLUMN_MAP);
  const columns = camelKeys.map((k) => LEAD_COLUMN_MAP[k]);

  const values = rowsOfData.map((data) =>
    camelKeys.map((camelKey) => {
      const value = data[camelKey];
      return value === undefined || value === "" ? null : value;
    })
  );

  const [result] = await pool.query(
    `INSERT INTO leads (${columns.join(", ")}) VALUES ?`,
    [values]
  );

  return result.affectedRows;
};

// Existing email/phone values for a company, used by the importer to
// skip rows that would duplicate a lead already in the CRM.
const getExistingContacts = async (companyId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT email, phone FROM leads WHERE company_id = ?",
    [companyId]
  );

  return {
    emails: new Set(rows.filter((r) => r.email).map((r) => r.email.toLowerCase())),
    phones: new Set(rows.filter((r) => r.phone).map((r) => r.phone.trim())),
  };
};

const Lead = {
  findAll,
  findByIdAndCompany,
  create,
  updateFields,
  remove,
  addNote,
  deleteNote,
  addFollowUp,
  updateFollowUpStatus,
  deleteFollowUpEntry,
  bulkInsert,
  getExistingContacts,
};

export default Lead;
