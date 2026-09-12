import { useEffect, useState } from "react";

import {
  Users,
  UserPlus,
  Trophy,
  XCircle,
  TrendingUp,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import StatCard from "../common/StatCard";

import leadService from "../../services/leadService";


function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    won: 0,
    lost: 0,
    conversionRate: 0,
  });

  const [conversionTrend, setConversionTrend] =
    useState([]);

  const [recentLeads, setRecentLeads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboard,dashboardResponse, leadsResponse] =
        await Promise.all([
          leadService.getDashboardStats(),
          leadService.getStats(),
          leadService.getLeads(),
        ]);


      // Dashboard statistics
      setStats(
        dashboardResponse.stats || {
          total: 0,
          new: 0,
          won: 0,
          lost: 0,
          conversionRate: 0,
        }
      );

      // We will build the chart from the response,
      // but only keep the previous 7 days.
      // NOTE: this now expects each point to carry both
      // `won` and `lost` counts, e.g. { date, won, lost }.
      // If your API only returns `won` today, add `lost`
      // to that same endpoint so both lines have data.
      setConversionTrend(
        dashboard.conversionTrend || []
      );


      const leads =
        leadsResponse.leads ||
        leadsResponse.data ||
        [];

      const now = new Date();

      // Start of today
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      // 7 days ago
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 6
      );

      const recent = leads
        .filter((lead) => {
          if (!lead.createdAt) return false;

          const createdAt = new Date(
            lead.createdAt
          );

          return (
            createdAt >= sevenDaysAgo &&
            createdAt <= now
          );
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

      setRecentLeads(recent);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);




  const statusData = [
    {
      name: "New",
      value: stats.new,
      className:
        "bg-blue-500",
    },

    {
      name: "Won",
      value: stats.won,
      className:
        "bg-emerald-500",
    },

    {
      name: "Lost",
      value: stats.lost,
      className:
        "bg-red-500",
    },
  ];


  const statusStyles = {
    new:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    replied:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",

    interested:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

    contacted:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

    meeting_scheduled:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

    proposal_sent:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

    negotiation:
      "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",

    won:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

    lost:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatChartDate = (date) => {
  if (!date) return "";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
  });
};



  return (
    <div className="space-y-7">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h1 className="text-2xl font-bold sm:text-3xl">
              Dashboard
            </h1>

          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your business performance for the last 7 days.
          </p>

        </div>


        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">

          <CalendarDays
            size={16}
          />

          Last 7 days

        </div>

      </div>


      {/* -------------------------------- */}
      {/* KPI CARDS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Leads"
          value={
            loading
              ? "..."
              : stats.total
          }
          icon={Users}
        />

        <StatCard
          title="New Leads"
          value={
            loading
              ? "..."
              : stats.new
          }
          icon={UserPlus}
        />

        <StatCard
          title="Won Leads"
          value={
            loading
              ? "..."
              : stats.won
          }
          icon={Trophy}
        />

        <StatCard
          title="Lost Leads"
          value={
            loading
              ? "..."
              : stats.lost
          }
          icon={XCircle}
        />

        <StatCard
          title="Conversion Rate"
          value={
            loading
              ? "..."
              : `${stats.conversionRate}%`
          }
          icon={TrendingUp}
        />

      </div>


      {/* -------------------------------- */}
      {/* CHART + STATUS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

         {/* Won vs Lost Trend */}

<div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">

  <div className="flex flex-wrap items-start justify-between gap-3">

    <div>
      <h2 className="font-semibold text-slate-900 dark:text-white">
        Won vs Lost Trend
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Leads closed in the last 7 days, by outcome
      </p>
    </div>

    <div className="flex items-center gap-2">

      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {stats.won || 0} Won
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        {stats.lost || 0} Lost
      </div>

    </div>

  </div>


  <div className="mt-5 h-[240px]">

    {loading ? (

      <div className="flex h-full items-center justify-center">

        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />

      </div>

    ) : conversionTrend.length === 0 ? (

      <div className="flex h-full flex-col items-center justify-center">

        <TrendingUp
          size={30}
          className="text-slate-300 dark:text-slate-700"
        />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          No conversion data for the last 7 days.
        </p>

      </div>

    ) : (

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={conversionTrend}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >

          <defs>

            <linearGradient
              id="wonGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#10b981"
                stopOpacity={0.25}
              />

              <stop
                offset="100%"
                stopColor="#10b981"
                stopOpacity={0}
              />

            </linearGradient>

            <linearGradient
              id="lostGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#ef4444"
                stopOpacity={0.2}
              />

              <stop
                offset="100%"
                stopColor="#ef4444"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>


          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            className="stroke-slate-200 dark:stroke-slate-800"
          />


          <XAxis
            dataKey="date"
            tickFormatter={formatChartDate}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
            }}
            className="fill-slate-500"
          />


          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
            }}
            className="fill-slate-500"
          />


          <Tooltip
            formatter={(value, name) => [
              `${value} ${name === "won" ? "won" : "lost"}`,
              name === "won" ? "Won" : "Lost",
            ]}
            labelFormatter={(label) =>
              new Date(
                `${label}T00:00:00`
              ).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                }
              )
            }
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "white",
              fontSize: "13px",
            }}
          />


          <Area
            type="linear"
            dataKey="won"
            name="won"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#wonGradient)"
            dot={{
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />

          <Area
            type="linear"
            dataKey="lost"
            name="lost"
            stroke="#ef4444"
            strokeWidth={3}
            fill="url(#lostGradient)"
            dot={{
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    )}

  </div>

</div>   





        {/* Status Overview */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

          <div>

            <h2 className="font-semibold">
              Lead Status
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Last 7 days
            </p>

          </div>


          <div className="mt-7 space-y-6">

            {statusData.map(
              (status) => {

                const percentage =
                  stats.total > 0
                    ? Math.round(
                        (status.value /
                          stats.total) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={status.name}
                  >

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <span
                          className={`h-2.5 w-2.5 rounded-full ${status.className}`}
                        />

                        <span className="text-sm font-medium">
                          {status.name}
                        </span>

                      </div>


                      <div className="text-sm">

                        <span className="font-semibold">
                          {status.value}
                        </span>

                        <span className="ml-1 text-slate-400">
                          ({percentage}%)
                        </span>

                      </div>

                    </div>


                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                      <div
                        className={`h-full rounded-full transition-all ${status.className}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>


          <Link
            to="/admin/leads"
            className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >

            Manage Leads

            <ArrowRight
              size={15}
            />

          </Link>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* RECENT LEADS */}
      {/* -------------------------------- */}

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">

          <div>

            <h2 className="font-semibold">
              Recent Leads
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Latest leads from the last 7 days
            </p>

          </div>


          <Link
            to="/admin/leads"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >

            View all

            <ArrowRight
              size={15}
            />

          </Link>

        </div>

        {/* Column headers — only meaningful once rows are in a real grid,
            so this appears alongside the layout fix below */}
        {!loading && recentLeads.length > 0 && (
          <div
            className="
              hidden
              border-b border-slate-100
              px-5 py-2.5
              text-xs font-medium uppercase tracking-wide
              text-slate-400
              sm:grid sm:grid-cols-[minmax(0,1fr)_100px_110px_150px]
              sm:items-center sm:gap-4
              dark:border-slate-800 dark:text-slate-500
            "
          >
            <span>Lead</span>
            <span>Received</span>
            <span>Source</span>
            <span className="text-right">Status</span>
          </div>
        )}


        <div className="divide-y divide-slate-100 dark:divide-slate-800">

          {loading ? (

            <div className="p-10 text-center text-sm text-slate-500">
              Loading leads...
            </div>

          ) : recentLeads.length === 0 ? (

            <div className="p-10 text-center text-sm text-slate-500">
              No leads received in the last 7 days.
            </div>

          ) : (

            recentLeads.map(
              (lead) => (

                <Link
                  to={`/admin/leads/${lead._id}`}
                  key={lead._id}
                  className="
                    flex flex-col gap-4
                    p-5
                    transition hover:bg-slate-50
                    sm:grid sm:grid-cols-[minmax(0,1fr)_100px_110px_150px]
                    sm:items-center sm:gap-4
                    dark:hover:bg-slate-800/40
                  "
                >

                  {/* Lead column */}
                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">

                      {lead.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>


                    <div className="min-w-0">

                      <p className="truncate font-medium">
                        {lead.name}
                      </p>

                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                        {lead.email}
                      </p>

                    </div>

                  </div>


                  {/* Received column */}
                  <div className="flex items-center justify-between sm:block">
                    <span className="text-xs text-slate-400 sm:hidden">
                      Received
                    </span>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(
                        lead.createdAt
                      )}
                    </p>
                  </div>


                  {/* Source column */}
                  <div className="flex items-center justify-between sm:block">
                    <span className="text-xs text-slate-400 sm:hidden">
                      Source
                    </span>

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {lead.source ||
                        "Website"}
                    </span>
                  </div>


                  {/* Status column */}
                  <div className="flex items-center justify-between sm:justify-end">
                    <span className="text-xs text-slate-400 sm:hidden">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                        statusStyles[
                          lead.status
                        ] ||
                        statusStyles.new
                      }`}
                    >
                      {lead.status ||
                        "new"}
                    </span>
                  </div>

                </Link>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}


export default Dashboard;
