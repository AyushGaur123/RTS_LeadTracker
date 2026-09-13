import {
  ArrowLeft, Mail, Phone, Building2, CalendarDays, Clock3, MessageSquare,
  CheckCircle2, Circle, Plus, X, Bell, TrendingUp, FileText,
  Trash2, AlertTriangle,
  Share2,
  Globe, Star, Gauge,
  MessageCircle, Camera, Briefcase, Video, ExternalLink, Inbox, MapPinned,
  Images, Quote,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import leadService from "../../services/leadService";
import toast from "react-hot-toast";

const STATUSES = [
  "new", "contacted", "replied", "interested", "meeting_scheduled",
  "proposal_sent", "negotiation", "won", "lost",
];

const STATUS_LABELS = {
  new: "NEW",
  contacted: "CONTACTED",
  replied: "REPLIED",
  interested: "INTERESTED",
  meeting_scheduled: "MEETING SCHEDULED",
  proposal_sent: "PROPOSAL SENT",
  negotiation: "NEGOTIATION",
  won: "WON",
  lost: "LOST",
};

const LOST_REASONS = [
  { value: "price", label: "Price", description: "The lead found the price too high." },
  { value: "competitor", label: "Competitor", description: "The lead chose another competitor." },
  { value: "not_interested", label: "Not Interested", description: "The lead is no longer interested." },
  { value: "no_response", label: "No Response", description: "The lead stopped responding." },
  { value: "other", label: "Other", description: "Another reason not listed above." },
];

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

// Spreadsheet "image" columns often hold 3–4 URLs in one cell,
// comma-separated. Split and clean them into a plain array.
function parseImageList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

// A "Top 5 Comments" cell can be delimited any number of ways
// depending on how the spreadsheet was built. Try the common
// delimiters in order of specificity and use whichever actually
// splits the text into more than one piece; otherwise show it as
// a single block.
function parseCommentsList(value) {
  if (!value) return [];
  const raw = String(value).trim();
  if (!raw) return [];

  const delimiterPatterns = [/\r?\n+/, /\s*\|\s*/, /\s*;\s*/, /(?:^|\s)\d+[.)]\s+/];
  for (const pattern of delimiterPatterns) {
    const parts = raw.split(pattern).map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
  }

  return [raw];
}

function StatusBadge({ status }) {
  const styles = {
    new: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    contacted: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    replied: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
    interested: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    meeting_scheduled: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    proposal_sent: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
    negotiation: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    won: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    lost: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function ContactChip({ icon, tone, label, value }) {
  const tones = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  };
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, tone, label, value, caption }) {
  const tones = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    green: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    red: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{caption}</p>
    </div>
  );
}

function LinkTile({ icon, label, href, tone = "slate" }) {
  const tones = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    pink: "bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
    red: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    slate: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };
  const normalizedHref = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return (
    <a
      href={normalizedHref}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">{href}</p>
      </div>
      <ExternalLink size={14} className="shrink-0 text-slate-400" />
    </a>
  );
}

function Field({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="break-words text-sm text-slate-800 dark:text-slate-200">{String(value)}</p>
    </div>
  );
}

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function EmptyNotes() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <MessageSquare size={26} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">No activity yet</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Add your first note to start tracking this lead.</p>
    </div>
  );
}

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [showFullMessage, setShowFullMessage] = useState(false);

  const [newFollowUpDate, setNewFollowUpDate] = useState("");
  const [newFollowUpNote, setNewFollowUpNote] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [followUpActionId, setFollowUpActionId] = useState(null);

  const [showLostReasonModal, setShowLostReasonModal] = useState(false);
  const [selectedLostReason, setSelectedLostReason] = useState("");
  const [savingLostReason, setSavingLostReason] = useState(false);

  const [deletingNote, setDeletingNote] = useState(null);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id);
      setLead(response.lead);
    } catch (error) {
      console.error("Failed to fetch lead:", error);
      toast.error(error.response?.data?.message || "Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const getFollowUpStatus = () => {
    if (!lead) return null;

    if (!lead.followUpDate) {
      return { key: "none", label: "No follow-up scheduled", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" };
    }

    const today = new Date();
    const followUp = new Date(lead.followUpDate);
    today.setHours(0, 0, 0, 0);
    followUp.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((followUp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { key: "overdue", label: "Overdue", className: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" };
    if (diffDays === 0) return { key: "today", label: "Today", className: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400" };
    if (diffDays === 1) return { key: "tomorrow", label: "Tomorrow", className: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" };

    return { key: "upcoming", label: `In ${diffDays} days`, className: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" };
  };

  const followUpStatus = getFollowUpStatus();

  const handleAddFollowUp = async () => {
    if (!newFollowUpDate) {
      toast.error("Please select a date and time");
      return;
    }
    try {
      setSavingFollowUp(true);
      const response = await leadService.addFollowUp(id, {
        dueDate: newFollowUpDate,
        note: newFollowUpNote.trim(),
      });
      setLead(response.lead);
      setNewFollowUpDate("");
      setNewFollowUpNote("");
      toast.success("Follow-up scheduled successfully");
    } catch (error) {
      console.error("Failed to add follow-up:", error);
      toast.error(error.response?.data?.message || "Failed to schedule follow-up");
    } finally {
      setSavingFollowUp(false);
    }
  };

  const handleToggleFollowUp = async (followUp) => {
    const nextStatus = followUp.status === "done" ? "pending" : "done";
    try {
      setFollowUpActionId(followUp._id);
      const response = await leadService.updateFollowUpStatus(id, followUp._id, nextStatus);
      setLead(response.lead);
    } catch (error) {
      console.error("Failed to update follow-up:", error);
      toast.error(error.response?.data?.message || "Failed to update follow-up");
    } finally {
      setFollowUpActionId(null);
    }
  };

  const handleDeleteFollowUpEntry = (followUpId) => {
    toast(
      (t) => (
        <div className="w-[280px]">
          <p className="font-semibold text-slate-900">Delete this follow-up?</p>
          <p className="mt-1 text-sm text-slate-500">This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => toast.dismiss(t.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  setFollowUpActionId(followUpId);
                  const response = await leadService.deleteFollowUpEntry(id, followUpId);
                  setLead(response.lead);
                  toast.success("Follow-up deleted successfully");
                } catch (error) {
                  console.error("Failed to delete follow-up:", error);
                  toast.error(error.response?.data?.message || "Failed to delete follow-up");
                } finally {
                  setFollowUpActionId(null);
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  // Status/style for one follow-up entry in the list (separate from
  // getFollowUpStatus above, which only describes the lead's single
  // nearest-pending date used by the stat card).
  const getEntryStatus = (entry) => {
    if (entry.status === "done") {
      return {
        key: "done",
        label: "Completed",
        wrapClass: "border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10",
        iconClass: "text-green-500",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(entry.dueDate);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { key: "overdue", label: "Overdue", wrapClass: "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10", iconClass: "text-red-500" };
    }
    if (diffDays === 0) {
      return { key: "today", label: "Today", wrapClass: "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10", iconClass: "text-amber-500" };
    }
    if (diffDays === 1) {
      return { key: "tomorrow", label: "Tomorrow", wrapClass: "border-indigo-200 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10", iconClass: "text-indigo-500" };
    }
    return { key: "upcoming", label: `In ${diffDays} days`, wrapClass: "border-indigo-200 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10", iconClass: "text-indigo-500" };
  };

  const sortedFollowUps = [...(lead?.followUps || [])].sort((a, b) => {
    if (a.status !== b.status) return a.status === "done" ? 1 : -1;
    const diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return a.status === "done" ? -diff : diff;
  });

  const handleStatusChange = async (status) => {
    if (status === "lost") {
      setSelectedLostReason(lead?.lostReason || "");
      setShowLostReasonModal(true);
      return;
    }
    try {
      setUpdatingStatus(true);
      const response = await leadService.updateLeadStatus(id, status);
      setLead(response.lead);
      toast.success(`Lead status changed to ${STATUS_LABELS[status]}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(error.response?.data?.message || "Failed to update lead status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleLostLead = async () => {
    if (!selectedLostReason) {
      toast.error("Please select a reason");
      return;
    }
    try {
      setSavingLostReason(true);
      const response = await leadService.updateLeadStatus(id, "lost", selectedLostReason);
      setLead(response.lead);
      setShowLostReasonModal(false);
      setSelectedLostReason("");
      toast.success("Lead marked as lost");
    } catch (error) {
      console.error("Failed to mark lead as lost:", error);
      toast.error(error.response?.data?.message || "Failed to update lead status");
    } finally {
      setSavingLostReason(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      setSavingNote(true);
      const response = await leadService.addNote(id, note);
      setLead(response.lead);
      setNote("");
      toast.success("Note added successfully");
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error(error.response?.data?.message || "Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    toast(
      (t) => (
        <div className="w-[280px]">
          <p className="font-semibold text-slate-900">Delete this note?</p>
          <p className="mt-1 text-sm text-slate-500">This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => toast.dismiss(t.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingToast = toast.loading("Deleting note...");
                try {
                  setDeletingNote(noteId);
                  const response = await leadService.deleteNote(lead._id, noteId);
                  setLead(response.lead);
                  toast.success("Note deleted successfully", { id: loadingToast });
                } catch (error) {
                  toast.error(error.response?.data?.message || "Failed to delete note", { id: loadingToast });
                } finally {
                  setDeletingNote(null);
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lead not found</h2>
        <button type="button" onClick={() => navigate("/admin/leads")} className="mt-4 text-blue-600 hover:underline">
          Back to Leads
        </button>
      </div>
    );
  }

  const currentStageIndex = STATUSES.indexOf(lead.status);
  const daysSinceCreated = lead.createdAt
    ? Math.max(0, Math.floor((new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const notesCount = lead.notes?.length || 0;
  const imageList = parseImageList(lead.imageUrl);
  const commentsList = parseCommentsList(lead.topComments);
  const hasWebsiteAudit = Boolean(
    lead.website ||
      lead.address ||
      lead.websiteStatus ||
      lead.https ||
      lead.mobileResponsive ||
      lead.pageSpeed ||
      lead.outdatedIndicators ||
      lead.leadScore ||
      lead.googleRating ||
      lead.googleReviewCount ||
      lead.googleReviewsUrl ||
      lead.googleMapsUrl ||
      lead.facebook ||
      lead.instagram ||
      lead.linkedin ||
      lead.youtube ||
      lead.allEmails ||
      lead.emailType ||
      lead.emailSource ||
      lead.emailCount
  );

  return (
    <>
      <div className="space-y-6">
        <Link to="/admin/leads" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          <ArrowLeft size={17} />
          Back to Leads
        </Link>

        <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <svg
            aria-hidden="true"
            viewBox="0 0 240 160"
            className="pointer-events-none absolute -right-6 -top-6 hidden h-44 w-44 text-blue-600 opacity-[0.06] lg:block dark:text-blue-400 dark:opacity-[0.08]"
          >
            <ellipse cx="120" cy="95" rx="85" ry="30" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="60" cy="60" r="16" fill="currentColor" />
            <circle cx="120" cy="42" r="16" fill="currentColor" />
            <circle cx="180" cy="60" r="16" fill="currentColor" />
            <path d="M60 78 L60 95 M120 60 L120 95 M180 78 L180 95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {imageList[0] ? (
                <img
                  src={imageList[0]}
                  alt={lead.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-sm"
                />
              ) : null}
              <div
                style={imageList[0] ? { display: "none" } : undefined}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-base font-bold text-white shadow-sm"
              >
                {getInitials(lead.name)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    Created {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-IN") : "Unknown"}
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {daysSinceCreated === 0 ? "Added today" : `${daysSinceCreated} day${daysSinceCreated === 1 ? "" : "s"} in pipeline`}
                  </span>
                </p>
              </div>
            </div>
            <StatusBadge status={lead.status} />
          </div>

          <div className="relative mt-6 grid gap-3 border-t border-gray-100 pt-6 dark:border-gray-800 sm:grid-cols-4">
            <ContactChip icon={<Mail size={17} />} tone="blue" label="Email" value={lead.email || "Not provided"} />
            <ContactChip icon={<Phone size={17} />} tone="green" label="Phone" value={lead.phone || "Not provided"} />
            <ContactChip icon={<Building2 size={17} />} tone="purple" label="Company" value={lead.company || "Not provided"} />
            <ContactChip icon={<Share2 size={17} />} tone="purple" label="Source" value={lead.source || "Not provided"} />
          </div>
        </section>

        {imageList.length > 0 && (
          <SectionCard icon={<Images size={17} />} title="Photos" subtitle={`${imageList.length} image${imageList.length === 1 ? "" : "s"} from the leads spreadsheet.`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {imageList.map((url, index) => (
                <a
                  key={`${url}-${index}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
                >
                  <img
                    src={url}
                    alt={`${lead.name} ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.parentElement.style.display = "none";
                    }}
                    className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </SectionCard>
        )}

        {hasWebsiteAudit && (
          <>
            {/* Business Information */}
            {(lead.company || lead.address || lead.website || lead.websiteStatus) && (
              <SectionCard icon={<Building2 size={17} />} title="Business Information">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Business Name" value={lead.name} />
                  <Field label="Phone" value={lead.phone} />
                  <Field label="Email" value={lead.email} />
                  <Field label="Address" value={lead.address} />
                  <Field label="Website" value={lead.website} />
                  <Field label="Website Status" value={lead.websiteStatus} />
                </div>
                {lead.website && (
                  <div className="mt-5">
                    <LinkTile icon={<Globe size={17} />} tone="blue" label="Visit Website" href={lead.website} />
                  </div>
                )}
              </SectionCard>
            )}

            {/* Website Analysis */}
            {(lead.https || lead.mobileResponsive || lead.pageSpeed || lead.outdatedIndicators || lead.leadScore) && (
              <SectionCard icon={<Gauge size={17} />} title="Website Analysis" subtitle="Audit data pulled in from the leads spreadsheet.">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="HTTPS" value={lead.https} />
                  <Field label="Mobile Responsive" value={lead.mobileResponsive} />
                  <Field label="Page Speed" value={lead.pageSpeed} />
                  <Field label="Outdated Indicators" value={lead.outdatedIndicators} />
                  <Field label="Lead Score" value={lead.leadScore} />
                </div>
              </SectionCard>
            )}

            {/* Google Information */}
            {(lead.googleRating || lead.googleReviewCount || lead.googleReviewsUrl || lead.googleMapsUrl) && (
              <SectionCard icon={<Star size={17} />} title="Google Information">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Google Rating" value={lead.googleRating} />
                  <Field label="Review Count" value={lead.googleReviewCount} />
                </div>
                {(lead.googleReviewsUrl || lead.googleMapsUrl) && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {lead.googleReviewsUrl && (
                      <LinkTile icon={<Star size={17} />} tone="indigo" label="Google Reviews" href={lead.googleReviewsUrl} />
                    )}
                    {lead.googleMapsUrl && (
                      <LinkTile icon={<MapPinned size={17} />} tone="indigo" label="Google Maps" href={lead.googleMapsUrl} />
                    )}
                  </div>
                )}
              </SectionCard>
            )}

            {/* Social Media */}
            {(lead.facebook || lead.instagram || lead.linkedin || lead.youtube || lead.socialMediaFound || lead.socialMediaLinks) && (
              <SectionCard icon={<Share2 size={17} />} title="Social Media">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {lead.facebook && <LinkTile icon={<MessageCircle size={17} />} tone="blue" label="Facebook" href={lead.facebook} />}
                  {lead.instagram && <LinkTile icon={<Camera size={17} />} tone="pink" label="Instagram" href={lead.instagram} />}
                  {lead.linkedin && <LinkTile icon={<Briefcase size={17} />} tone="blue" label="LinkedIn" href={lead.linkedin} />}
                  {lead.youtube && <LinkTile icon={<Video size={17} />} tone="red" label="YouTube" href={lead.youtube} />}
                </div>
                {(lead.socialMediaFound || lead.socialMediaLinks) && (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <Field label="Social Media Found" value={lead.socialMediaFound} />
                    <Field label="Social Media Links" value={lead.socialMediaLinks} />
                  </div>
                )}
              </SectionCard>
            )}

            {/* Email Information */}
            {(lead.allEmails || lead.emailType || lead.emailSource || lead.emailCount || lead.emailCount === 0) && (
              <SectionCard icon={<Inbox size={17} />} title="Email Information">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Email" value={lead.email} />
                  <Field label="Email Count" value={lead.emailCount} />
                  <Field label="Email Source" value={lead.emailSource} />
                  <Field label="Email Type" value={lead.emailType} />
                  <Field label="All Emails" value={lead.allEmails} />
                </div>
              </SectionCard>
            )}
          </>
        )}

        {commentsList.length > 0 && (
          <SectionCard icon={<Quote size={17} />} title="Top Comments" subtitle="Customer feedback pulled in from the leads spreadsheet.">
            <div className="space-y-3">
              {commentsList.slice(0, 5).map((comment, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
                >
                  <Quote size={16} className="mt-0.5 shrink-0 text-indigo-400 dark:text-indigo-500" />
                  <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{comment}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<TrendingUp size={18} />}
            tone="blue"
            label="Pipeline Stage"
            value={`${Math.max(currentStageIndex + 1, 1)} / ${STATUSES.length}`}
            caption={STATUS_LABELS[lead.status]}
          />
          <StatCard
            icon={<Clock3 size={18} />}
            tone="indigo"
            label="Days Open"
            value={daysSinceCreated}
            caption={daysSinceCreated === 1 ? "day since created" : "days since created"}
          />
          <StatCard
            icon={<FileText size={18} />}
            tone="purple"
            label="Activity Logged"
            value={notesCount}
            caption={notesCount === 1 ? "note recorded" : "notes recorded"}
          />
          <StatCard
            icon={<Bell size={18} />}
            tone={followUpStatus?.key === "overdue" ? "red" : followUpStatus?.key === "today" ? "orange" : followUpStatus?.key === "none" ? "slate" : "green"}
            label="Next Follow-up"
            value={lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
            caption={followUpStatus?.label}
          />
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Lead Pipeline</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track the progress of this lead.</p>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[900px] items-start">
              {STATUSES.map((status, index) => {
                const currentIndex = STATUSES.indexOf(lead.status);
                const isCurrent = lead.status === status;
                const isCompleted = index < currentIndex && lead.status !== "lost";

                return (
                  <div key={status} className="flex flex-1 items-start">
                    <button
                      type="button"
                      disabled={updatingStatus || savingLostReason}
                      onClick={() => handleStatusChange(status)}
                      className="group flex flex-col items-center"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                          isCurrent
                            ? "border-blue-600 bg-blue-600 text-white"
                            : isCompleted
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                      >
                        {isCurrent || isCompleted ? <CheckCircle2 size={18} /> : <Circle size={17} />}
                      </div>
                      <span className={`mt-3 max-w-24 text-center text-xs font-semibold ${isCurrent ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-500"}`}>
                        {STATUS_LABELS[status]}
                      </span>
                    </button>

                    {index < STATUSES.length - 1 && (
                      <div className={`mt-5 h-0.5 flex-1 ${index < currentIndex ? "bg-green-500" : "bg-gray-200 dark:bg-gray-800"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {lead.status === "lost" && lead.lostReason && (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-500/10">
              <AlertTriangle size={19} className="mt-0.5 shrink-0 text-red-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-red-500">Lost Reason</p>
                <p className="mt-1 text-sm font-semibold text-red-700 dark:text-red-400">
                  {LOST_REASONS.find((item) => item.value === lead.lostReason)?.label || lead.lostReason}
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-gray-900 dark:text-white">Original Message</h2>
            </div>
            <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
              {lead.message ? (
                <>
                  <p className={`whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300 ${showFullMessage ? "" : "line-clamp-4"}`}>
                    {lead.message}
                  </p>
                  {lead.message.length > 160 && (
                    <button
                      type="button"
                      onClick={() => setShowFullMessage((value) => !value)}
                      className="mt-2 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {showFullMessage ? "Show less" : "Show more"}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No message provided.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <CalendarDays size={19} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Follow-ups</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Schedule as many follow-ups as you need, with a note on each.</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_1fr]">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Date &amp; time</label>
                  <input
                    type="datetime-local"
                    value={newFollowUpDate}
                    onChange={(e) => setNewFollowUpDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Note (optional)</label>
                  <input
                    type="text"
                    value={newFollowUpNote}
                    onChange={(e) => setNewFollowUpNote(e.target.value)}
                    placeholder="What's this follow-up about?"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddFollowUp}
                disabled={savingFollowUp || !newFollowUpDate}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={16} />
                {savingFollowUp ? "Scheduling..." : "Add Follow-up"}
              </button>
            </div>

            <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {sortedFollowUps.length ? (
                sortedFollowUps.map((entry) => {
                  const entryStatus = getEntryStatus(entry);
                  const isBusy = followUpActionId === entry._id;
                  return (
                    <div key={entry._id} className={`rounded-xl border p-4 ${entryStatus.wrapClass}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <Bell size={17} className={`mt-0.5 shrink-0 ${entryStatus.iconClass}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{entryStatus.label}</p>
                            <p className={`mt-1 font-semibold text-slate-900 dark:text-white ${entry.status === "done" ? "line-through opacity-70" : ""}`}>
                              {new Date(entry.dueDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                            </p>
                            {entry.note && (
                              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm text-slate-600 dark:text-slate-400">{entry.note}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleFollowUp(entry)}
                            disabled={isBusy}
                            title={entry.status === "done" ? "Mark as pending" : "Mark as done"}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-500/10 dark:hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {entry.status === "done" ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFollowUpEntry(entry._id)}
                            disabled={isBusy}
                            title="Delete follow-up"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center dark:border-slate-700">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <CalendarDays size={22} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">No follow-ups scheduled</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Add one above to plan your next action.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Notes & Follow-ups</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Keep track of conversations and actions.</p>
          </div>

          <div className="mt-5">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this lead..."
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddNote}
              disabled={savingNote || !note.trim()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              {savingNote ? "Adding..." : "Add Note"}
            </button>
          </div>

          <div className="mt-8">
            {lead.notes?.length ? (
              <div className="relative space-y-5">
                {[...lead.notes].reverse().map((item, index) => (
                  <div key={item._id} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <Clock3 size={16} />
                      </div>
                      {index !== lead.notes.length - 1 && <div className="mt-2 w-px flex-1 bg-slate-200 dark:bg-slate-800" />}
                    </div>

                    <div className="mb-1 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Activity</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                            <Clock3 size={13} />
                            {item.createdAt ? new Date(item.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(item._id)}
                            disabled={deletingNote === item._id}
                            title="Delete note"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingNote === item._id ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyNotes />
            )}
          </div>
        </section>
      </div>

      {showLostReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Why was this lead lost?</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select the main reason for losing this lead.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (savingLostReason) return;
                  setShowLostReasonModal(false);
                  setSelectedLostReason("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {LOST_REASONS.map((reason) => {
                const isSelected = selectedLostReason === reason.value;
                return (
                  <button
                    key={reason.value}
                    type="button"
                    disabled={savingLostReason}
                    onClick={() => setSelectedLostReason(reason.value)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${isSelected ? "text-red-700 dark:text-red-400" : "text-slate-800 dark:text-slate-200"}`}>
                        {reason.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{reason.description}</p>
                    </div>
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-red-500" : "border-slate-300 dark:border-slate-600"}`}>
                      {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={savingLostReason}
                onClick={() => {
                  setShowLostReasonModal(false);
                  setSelectedLostReason("");
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingLostReason || !selectedLostReason}
                onClick={handleLostLead}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingLostReason ? "Saving..." : "Mark as Lost"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LeadDetails;
