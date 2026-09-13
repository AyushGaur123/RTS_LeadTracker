import * as XLSX from "xlsx";
import Lead from "../../models/Lead.js";

// Normalizes a spreadsheet header ("Google Rating", "google_rating",
// "Google-Rating ") into a single snake_case key so we can match it
// regardless of how the column was named.
const normalizeHeader = (header) =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

// Maps every normalized header we expect to the field name on the
// Lead model. Add more aliases here if a spreadsheet uses slightly
// different column names.
const FIELD_MAP = {
  name: "name",
  business_name: "name",
  company_name: "name",
  phone: "phone",
  phone_number: "phone",
  website: "website",
  address: "address",
  website_status: "websiteStatus",
  https: "https",
  mobile_responsive: "mobileResponsive",
  page_speed: "pageSpeed",
  outdated_indicators: "outdatedIndicators",
  lead_score: "leadScore",
  google_rating: "googleRating",
  google_review_count: "googleReviewCount",
  google_reviews_url: "googleReviewsUrl",
  facebook: "facebook",
  instagram: "instagram",
  linkedin: "linkedin",
  youtube: "youtube",
  social_media_found: "socialMediaFound",
  social_media_links: "socialMediaLinks",
  email: "email",
  email_count: "emailCount",
  email_source: "emailSource",
  email_type: "emailType",
  all_emails: "allEmails",
  google_maps_url: "googleMapsUrl",
  image: "imageUrl",
  image_url: "imageUrl",
  photo: "imageUrl",
  photo_url: "imageUrl",
  picture: "imageUrl",
  picture_url: "imageUrl",
  logo: "imageUrl",
  logo_url: "imageUrl",
  profile_image: "imageUrl",
  avatar: "imageUrl",
  top_5_comments: "topComments",
  top_comments: "topComments",
  top_5_reviews: "topComments",
  comments: "topComments",
  review_comments: "topComments",
  customer_comments: "topComments",
  reviews: "topComments",
};

const NUMBER_FIELDS = new Set([
  "leadScore",
  "googleRating",
  "googleReviewCount",
  "emailCount",
]);

const toCleanString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const toNumberOrNull = (value) => {
  const num = parseFloat(String(value).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(num) ? num : null;
};

// Converts one parsed spreadsheet row (keyed by its original headers)
// into a Lead-shaped object.
const mapRowToLead = (row) => {
  const lead = {};

  for (const [rawHeader, rawValue] of Object.entries(row)) {
    const key = normalizeHeader(rawHeader);
    const field = FIELD_MAP[key];

    if (!field) continue;

    if (NUMBER_FIELDS.has(field)) {
      const num = toNumberOrNull(rawValue);
      if (num !== null) lead[field] = num;
    } else {
      const str = toCleanString(rawValue);
      if (str !== "") lead[field] = str;
    }
  }

  return lead;
};

// POST /api/leads/import
export const bulkImportLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a spreadsheet file." });
    }

    let workbook;
    try {
      workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Could not read that file. Please upload a valid .xlsx, .xls or .csv file.",
      });
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      return res
        .status(400)
        .json({ success: false, message: "The spreadsheet appears to be empty." });
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      return res
        .status(400)
        .json({ success: false, message: "No rows were found in the spreadsheet." });
    }

    // Existing emails/phones for this company, to avoid importing duplicates.
    const { emails: existingEmails, phones: existingPhones } = await Lead.getExistingContacts(
      req.user._id
    );

    const toInsert = [];
    const errors = [];
    const seenInFile = new Set(); // dedupe within the file itself

    rows.forEach((row, index) => {
      const rowNumber = index + 2; // account for header row, 1-indexed
      const mapped = mapRowToLead(row);

      if (!mapped.name && !mapped.phone && !mapped.email) {
        // Fully blank row — silently skip, not an error.
        return;
      }

      if (!mapped.name) {
        errors.push({ row: rowNumber, reason: "Missing a name/business name." });
        return;
      }

      const emailKey = mapped.email ? mapped.email.toLowerCase() : null;
      const phoneKey = mapped.phone ? mapped.phone.trim() : null;
      const dedupeKey = emailKey || phoneKey;

      if (emailKey && existingEmails.has(emailKey)) {
        errors.push({ row: rowNumber, reason: `Duplicate — "${mapped.name}" already exists (email).` });
        return;
      }

      if (phoneKey && existingPhones.has(phoneKey)) {
        errors.push({ row: rowNumber, reason: `Duplicate — "${mapped.name}" already exists (phone).` });
        return;
      }

      if (dedupeKey && seenInFile.has(dedupeKey)) {
        errors.push({ row: rowNumber, reason: `Duplicate row in the file for "${mapped.name}".` });
        return;
      }

      if (dedupeKey) seenInFile.add(dedupeKey);

      toInsert.push({
        ...mapped,
        source: "Import",
        status: "new",
        companyId: req.user._id,
        importedFrom: req.file.originalname,
      });
    });

    let inserted = 0;
    if (toInsert.length) {
      inserted = await Lead.bulkInsert(toInsert);
    }

    res.status(201).json({
      success: true,
      message: `Imported ${inserted} of ${rows.length} row(s).`,
      totalRows: rows.length,
      importedCount: inserted,
      skippedCount: errors.length,
      errors,
    });
  } catch (error) {
    console.error("BULK IMPORT LEADS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
