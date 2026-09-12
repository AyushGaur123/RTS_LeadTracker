import Lead from "../../models/Lead.js";

// MySQL auto_increment ids are plain positive integers now (no more
// Mongo ObjectId strings).
export const isValidId = (id) => /^\d+$/.test(String(id));

export const findCompanyLead = async (id, companyId) => {
  if (!isValidId(id)) {
    return { status: 400, message: "Invalid lead ID." };
  }

  const lead = await Lead.findByIdAndCompany(id, companyId);

  if (!lead) {
    return { status: 404, message: "Lead not found." };
  }

  return { lead };
};
