import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, Filter, UploadCloud,
  Users, Mail, Globe, Star, MapPin, ExternalLink, X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import leadService from "../../services/leadService";
import Modal from "../common/Modal";
import LeadForm from "./LeadForm";
import StatCard from "../common/StatCard";

// Values that should NOT be treated as a real website/email.
const INVALID_VALUES = new Set([
  "", "n/a", "na", "none", "null", "undefined",
  "not found", "not available", "no website", "no", "-", "—",
]);

const hasWebsite = (website) => {
  if (!website) return false;
  const value = String(website).trim().toLowerCase();
  if (INVALID_VALUES.has(value)) return false;
  return (
    value.includes(".") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("www.")
  );
};

const getWebsiteUrl = (website) => {
  if (!hasWebsite(website)) return null;
  let url = String(website).trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
};

const hasEmail = (email) => {
  if (!email) return false;
  const value = String(email).trim().toLowerCase();
  return !INVALID_VALUES.has(value) && value.includes("@");
};

function Leads() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await leadService.getLeads();

      setLeads(response.leads || response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        lead.name?.toLowerCase().includes(searchValue) ||
        lead.email?.toLowerCase().includes(searchValue) ||
        lead.company?.toLowerCase().includes(searchValue) ||
        lead.phone?.toLowerCase().includes(searchValue) ||
        lead.address?.toLowerCase().includes(searchValue);

      const matchesStatus = status === "all" || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

  const deleteLead = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmed) return;

    try {
      await leadService.deleteLead(id);
      toast.success("Lead deleted successfully");
      fetchLeads();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lead");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLead(null);
    fetchLeads();
  };

  const statusStyles = {
    new: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    contacted: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
    replied: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
    interested: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    meeting_scheduled: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    proposal_sent: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    negotiation: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
    won: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    lost: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  // -------- Quick stats --------
  const totalLeads = leads.length;
  const leadsWithEmail = leads.filter((lead) => hasEmail(lead.email)).length;
  const leadsWithWebsite = leads.filter((lead) => hasWebsite(lead.website)).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and track all your potential clients.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/admin/leads/import"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <UploadCloud size={18} />
            Import Leads
          </Link>

          <button
            onClick={() => {
              setEditingLead(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Leads" value={loading ? "..." : totalLeads} icon={Users} />
        <StatCard title="With Email" value={loading ? "..." : leadsWithEmail} icon={Mail} />
        <StatCard title="With Website" value={loading ? "..." : leadsWithWebsite} icon={Globe} />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, company or address..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 lg:w-48"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="replied">Replied</option>
              <option value="interested">Interested</option>
              <option value="meeting_scheduled">Meeting Scheduled</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <table className="w-full table-fixed">

          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[18%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Business</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Score</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Website</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center text-sm text-slate-500">
                  Loading leads...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <Search size={20} className="text-slate-400" />
                    </div>
                    <p className="font-medium">No leads found</p>
                    <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const websiteUrl = getWebsiteUrl(lead.website);

                return (
                  <tr
                    key={lead._id}
                    onClick={() => navigate(`/admin/leads/${lead._id}`)}
                    className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    {/* Business */}
                    <td className="px-4 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {lead.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium" title={lead.name}>{lead.name}</p>
                          {lead.company && (
                            <p className="truncate text-xs text-slate-500" title={lead.company}>{lead.company}</p>
                          )}
                          {lead.address && (
                            <p className="mt-0.5 flex min-w-0 items-start gap-1 text-xs text-slate-400">
                              <MapPin size={11} className="mt-0.5 shrink-0" />
                              <span className="truncate" title={lead.address}>{lead.address}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4">
                      <div className="min-w-0 space-y-1 text-sm">
                        {lead.phone && (
                          <p className="truncate text-slate-600 dark:text-slate-300">{lead.phone}</p>
                        )}
                        {hasEmail(lead.email) ? (
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400" title={lead.email}>{lead.email}</p>
                        ) : (
                          <p className="text-xs text-slate-400">No email</p>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-4">
                      {lead.googleRating ? (
                        <div>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-current text-amber-500 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {lead.googleRating}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {lead.googleReviewCount || 0} reviews
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">No rating</span>
                      )}
                    </td>

                    {/* Lead Score */}
                    <td className="px-4 py-4">
                      {lead.leadScore !== null && lead.leadScore !== undefined ? (
                        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {lead.leadScore}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>

                    {/* Website */}
                    <td className="px-4 py-4">
                      {websiteUrl ? (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 transition hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
                        >
                          <Globe size={13} />
                          Visit
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <Globe size={13} />
                          None
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                          statusStyles[lead.status] || statusStyles.new
                        }`}
                      >
                        {(lead.status || "new").replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingLead(lead);
                            setShowForm(true);
                          }}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLead(lead._id);
                          }}
                          title="Delete"
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>

        {/* Footer */}
        {!loading && (
          <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500 dark:border-slate-800">
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredLeads.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{leads.length}</span>{" "}
            leads
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingLead(null);
        }}
        title={editingLead ? "Edit Lead" : "Add New Lead"}
        size="lg"
      >
        <LeadForm
          lead={editingLead}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default Leads;
