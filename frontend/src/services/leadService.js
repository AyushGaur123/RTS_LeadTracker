import api from "./api";

const getLeads = async (params = {}) => {
  const response = await api.get("/leads", {
    params,
  });

  return response.data;
};

const getLead = async (id) => {
  const response = await api.get(
    `/leads/${id}`
  );

  return response.data;
};

const createLead = async (data) => {
  const response = await api.post(
    "/leads",
    data
  );

  return response.data;
};

const updateLead = async (id, data) => {
  const response = await api.put(
    `/leads/${id}`,
    data
  );

  return response.data;
};

const deleteLead = async (id) => {
  const response = await api.delete(
    `/leads/${id}`
  );

  return response.data;
};

const updateStatus = async (id, status) => {
  const response = await api.patch(
    `/leads/${id}/status`,
    { status }
  );

  return response.data;
};

const addNote = async (id, text) => {
  const response = await api.post(
    `/leads/${id}/notes`,
    { text }
  );

  return response.data;
};

const deleteNote = async (leadId, noteId) => {
  const response = await api.delete(
    `/leads/${leadId}/notes/${noteId}`
  );

  return response.data;
};


const updateFollowUp = async (leadId, followUpDate) => {
  const response = await api.patch(
    `/leads/${leadId}/follow-up`,
    { followUpDate }
  );

  return response.data;
};

const deleteFollowUp = async (leadId) => {
  const response = await api.patch(
    `/leads/${leadId}/follow-up`,
    { followUpDate: null }
  );

  return response.data;
};

const addFollowUp = async (leadId, { dueDate, note }) => {
  const response = await api.post(
    `/leads/${leadId}/follow-ups`,
    { dueDate, note }
  );

  return response.data;
};

const updateFollowUpStatus = async (leadId, followUpId, status) => {
  const response = await api.patch(
    `/leads/${leadId}/follow-ups/${followUpId}`,
    { status }
  );

  return response.data;
};

const deleteFollowUpEntry = async (leadId, followUpId) => {
  const response = await api.delete(
    `/leads/${leadId}/follow-ups/${followUpId}`
  );

  return response.data;
};

const getStats = async () => {
  const response = await api.get(
    "/leads/stats"
  );

  return response.data;
};


const createPublicLead = async (data) => {
  const response = await api.post(
    "/leads/public",
    data
  );

  console.log(response.data)

  return response.data;
};

const getLeadById = async (id) => {
  const response = await api.get(
    `/leads/${id}`
  );

  return response.data;
};

const updateLeadStatus = async (
  id,
  status,lostReason
) => {
  const response = await api.patch(
    `/leads/${id}/status`,
    { status,lostReason }
  );

  return response.data;
};

const getFollowUps = async () => {
  const response = await api.get(
    "/leads/follow-ups"
  );

  return response.data;
};

const getDashboardStats = async () => {
  const response = await api.get(
    "/leads/dashboard"
  );

  return response.data;
};

const getAdvancedAnalytics = async () => {
  const response = await api.get(
    "/leads/advanced"
  );

  return response.data;
};

const bulkImportLeads = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/leads/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const leadService = {
  getLeads,
  getLead,
  createLead,
  createPublicLead,
  updateLead,
  deleteLead,
  updateStatus,
  addNote,
  deleteNote,
  updateFollowUp,
  deleteFollowUp,
  addFollowUp,
  updateFollowUpStatus,
  deleteFollowUpEntry,
  getStats,
  getFollowUps,
  getLeadById,
  updateLeadStatus,
  getDashboardStats,
  getAdvancedAnalytics,
  bulkImportLeads,
};






export default leadService;