
import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  TrendingUp,
  Users,
  UserCheck,
  Target,
} from "lucide-react";

import toast from "react-hot-toast";

import leadService from "../../services/leadService";

function Analytics() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    replied: 0,
    interested: 0,
    meeting_scheduled: 0,
    proposal_sent: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
    conversionRate: 0,
  });

  const [sources, setSources] = useState([]);
  const [sourceConversion, setSourceConversion] = useState([]);
  const [lostReasons, setLostReasons] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const statsResponse =
          await leadService.getStats();

        const advancedResponse =
          await leadService.getAdvancedAnalytics();

        setStats(
          statsResponse?.stats || {
            total: 0,
            new: 0,
            contacted: 0,
            replied: 0,
            interested: 0,
            meeting_scheduled: 0,
            proposal_sent: 0,
            negotiation: 0,
            won: 0,
            lost: 0,
            conversionRate: 0,
          }
        );

        setSources(
          statsResponse?.sources ||
            advancedResponse?.sources ||
            []
        );

        const rawSourceConversion =
          advancedResponse?.sourceConversion ||
          advancedResponse?.data?.sourceConversion ||
          advancedResponse?.analytics?.sourceConversion ||
          [];

        const formattedSourceConversion =
          Array.isArray(rawSourceConversion)
            ? rawSourceConversion.map((item) => ({
                source:
                  item.source ||
                  item._id ||
                  item.name ||
                  "Unknown",

                won: Number(
                  item.won ??
                    item.wonCount ??
                    item.converted ??
                    0
                ),

                lost: Number(
                  item.lost ??
                    item.lostCount ??
                    0
                ),
              }))
            : [];

        setSourceConversion(
          formattedSourceConversion
        );

        const rawLostReasons =
          advancedResponse?.lostReasons ||
          advancedResponse?.data?.lostReasons ||
          advancedResponse?.analytics?.lostReasons ||
          [];

        const formattedLostReasons =
          Array.isArray(rawLostReasons)
            ? rawLostReasons.map((item) => ({
                reason:
                  item.reason ||
                  item._id ||
                  item.name ||
                  "Other",

                count: Number(
                  item.count ??
                    item.total ??
                    item.leads ??
                    0
                ),
              }))
            : [];

        setLostReasons(
          formattedLostReasons
        );
      } catch (error) {
        console.error(
          "ANALYTICS ERROR:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statusData = [
    { name: "New", key: "new", value: Number(stats?.new || 0) },
    { name: "Contacted", key: "contacted", value: Number(stats?.contacted || 0) },
    { name: "Replied", key: "replied", value: Number(stats?.replied || 0) },
    { name: "Interested", key: "interested", value: Number(stats?.interested || 0) },
    { name: "Meeting Scheduled", key: "meeting_scheduled", value: Number(stats?.meeting_scheduled || 0) },
    { name: "Proposal Sent", key: "proposal_sent", value: Number(stats?.proposal_sent || 0) },
    { name: "Negotiation", key: "negotiation", value: Number(stats?.negotiation || 0) },
    { name: "Won", key: "won", value: Number(stats?.won || 0) },
    { name: "Lost", key: "lost", value: Number(stats?.lost || 0) },
  ];

  const statusColors = [
    "#3B82F6", "#8B5CF6", "#06B6D4", "#F59E0B", "#F97316",
    "#EC4899", "#A855F7", "#22C55E", "#EF4444",
  ];

  const pipelineTotal = statusData.reduce((total, item) => total + item.value, 0);

  const CustomPipelineTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const percentage = pipelineTotal > 0 ? ((data.value / pipelineTotal) * 100).toFixed(1) : 0;

    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
          <p className="font-semibold text-slate-900 dark:text-white">{data.name}</p>
        </div>

        <div className="mt-2 flex justify-between gap-8">
          <span className="text-sm text-slate-500 dark:text-slate-400">Leads</span>
          <span className="font-semibold text-slate-900 dark:text-white">{data.value}</span>
        </div>

        <div className="mt-1 flex justify-between gap-8">
          <span className="text-sm text-slate-500 dark:text-slate-400">Percentage</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{percentage}%</span>
        </div>
      </div>
    );
  };

  const sourceData = sources.map((item) => ({
    name: item._id || item.source || item.name || "Unknown",
    leads: Number(item.count ?? item.leads ?? item.total ?? 0),
  }));

  const activeLeads =
    Number(stats.new || 0) +
    Number(stats.contacted || 0) +
    Number(stats.replied || 0) +
    Number(stats.interested || 0) +
    Number(stats.meeting_scheduled || 0) +
    Number(stats.proposal_sent || 0) +
    Number(stats.negotiation || 0);

  const cards = [
    { title: "Total Leads", value: stats.total, icon: Users, description: "All leads in your CRM" },
    { title: "Won Leads", value: stats.won, icon: UserCheck, description: "Successfully converted" },
    { title: "Conversion Rate", value: `${stats.conversionRate || 0}%`, icon: TrendingUp, description: "Overall conversion" },
    { title: "Active Leads", value: activeLeads, icon: Target, description: "Leads requiring action" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Understand your lead pipeline and business performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : card.value}
                  </p>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{card.description}</p>
                </div>

                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Lead Pipeline */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Lead Pipeline</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Distribution of leads by status</p>
            </div>

            <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {pipelineTotal} Leads
            </div>
          </div>

          <div className="mt-4 h-[280px] w-full min-w-0 sm:mt-6 sm:h-[320px]">
            {pipelineTotal === 0 ? (
              <EmptyChart icon="📊" title="No lead data yet" description="Your lead pipeline will appear here." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter((item) => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={68}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                    animationDuration={700}
                  >
                    {statusData
                      .filter((item) => item.value > 0)
                      .map((item) => {
                        const index = statusData.findIndex((status) => status.key === item.key);
                        return <Cell key={item.key} fill={statusColors[index]} />;
                      })}
                  </Pie>

                  <Tooltip content={<CustomPipelineTooltip />} />

                  <Legend
                    verticalAlign="bottom"
                    height={60}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Lead Sources</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Which channels generate the most leads</p>
          </div>

          <div className="mt-4 h-[280px] w-full min-w-0 sm:mt-6 sm:h-[320px]">
            {sourceData.length === 0 ? (
              <EmptyChart icon="📈" title="No source data" description="Lead source statistics will appear here." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -30, bottom: 10 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#cbd5e1" className="dark:opacity-20" />

                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />

                  <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />

                  <Bar dataKey="leads" name="Leads" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={55} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Source Conversion */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Source Conversion</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Won and lost leads by acquisition source</p>
          </div>

          <div className="mt-4 h-[280px] w-full min-w-0 sm:mt-6 sm:h-[320px]">
            {sourceConversion.length === 0 ? (
              <EmptyChart icon="🎯" title="No conversion data" description="Source conversion data will appear here." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceConversion} margin={{ top: 10, right: 10, left: -30, bottom: 10 }} barGap={6}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#cbd5e1" className="dark:opacity-20" />

                  <XAxis dataKey="source" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />

                  <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />

                  <Legend />

                  <Bar dataKey="won" name="Won" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="lost" name="Lost" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Lost Lead Reasons */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Lost Lead Reasons</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Why potential customers were lost</p>
          </div>

          <div className="mt-4 h-[280px] w-full min-w-0 sm:mt-6 sm:h-[320px]">
            {lostReasons.length === 0 ? (
              <EmptyChart icon="📉" title="No lost leads" description="Reasons for lost leads will appear here." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lostReasons} margin={{ top: 10, right: 10, left: -30, bottom: 10 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#cbd5e1" className="dark:opacity-20" />

                  <XAxis dataKey="reason" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />

                  <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />

                  <Bar dataKey="count" name="Lost Leads" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ icon, title, description }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
        {icon}
      </div>
      <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-500">{description}</p>
    </div>
  );
}

export default Analytics;
