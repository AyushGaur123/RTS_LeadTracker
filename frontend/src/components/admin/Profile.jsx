import {
  User,
  Mail,
  Building2,
  CalendarDays,
  ShieldCheck,
  FileText,
  BriefcaseBusiness,
  CircleUserRound,
} from "lucide-react";

import useAuthStore from "../../store/authStore";
import PageSkeleton from "../common/PageSkeleton";

function Profile() {
  const user = useAuthStore(
    (state) => state.user
  );

  const initialized = useAuthStore(
    (state) => state.initialized
  );

  if (!initialized || !user) {
    return <PageSkeleton />;
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Not available";

  const updatedDate = user.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Not available";

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Profile
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and view your personal and company information.
        </p>
      </div>


      {/* Profile Hero */}
      <section
        className="
          overflow-hidden
          rounded-3xl
          border border-gray-200
          bg-white
          shadow-sm
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        {/* Cover */}
        <div
          className="
            h-32
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-purple-600
            dark:from-blue-700
            dark:via-indigo-700
            dark:to-purple-800
          "
        />

        <div className="px-6 pb-6">

          {/* Avatar */}
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div
              className="
                flex h-24 w-24
                items-center justify-center
                rounded-3xl
                border-4
                border-white
                bg-gray-100
                text-gray-600
                shadow-md
                dark:border-gray-900
                dark:bg-gray-800
                dark:text-gray-300
              "
            >
              <CircleUserRound size={52} />
            </div>

            <div className="sm:pb-1">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-green-100
                  px-3 py-1.5
                  text-xs font-semibold
                  text-green-700
                  dark:bg-green-500/10
                  dark:text-green-400
                "
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />

                Active Admin
              </div>

            </div>

          </div>


          {/* Name */}
          <div className="mt-5">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Administrator at {user.companyName}
            </p>

          </div>

        </div>

      </section>


      {/* Personal Information */}
      <section
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        <div className="mb-6 flex items-center gap-3">

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
              dark:bg-blue-500/10
              dark:text-blue-400
            "
          >
            <User size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your account details
            </p>
          </div>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          <InfoCard
            icon={<User size={19} />}
            label="Full Name"
            value={user.name}
          />

          <InfoCard
            icon={<Mail size={19} />}
            label="Email Address"
            value={user.email}
          />

          <InfoCard
            icon={<ShieldCheck size={19} />}
            label="Account Role"
            value="Administrator"
          />

          <InfoCard
            icon={<CalendarDays size={19} />}
            label="Account Created"
            value={joinedDate}
          />

          <InfoCard
            icon={<CalendarDays size={19} />}
            label="Last Profile Update"
            value={updatedDate}
          />

        </div>

      </section>


      {/* Company Information */}
      <section
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        <div className="mb-6 flex items-center gap-3">

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              bg-purple-100
              text-purple-600
              dark:bg-purple-500/10
              dark:text-purple-400
            "
          >
            <Building2 size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              Company Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Information about your organization
            </p>
          </div>

        </div>


        <div className="space-y-5">

          {/* Company Name */}
          <InfoCard
            icon={<Building2 size={19} />}
            label="Company Name"
            value={user.companyName}
          />


          {/* Company Description */}
          <div
            className="
              rounded-xl
              border border-gray-200
              bg-gray-50
              p-5
              dark:border-gray-800
              dark:bg-gray-950
            "
          >

            <div className="flex items-center gap-3">

              <div className="text-gray-500 dark:text-gray-400">
                <FileText size={19} />
              </div>

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Company Description
              </p>

            </div>

            <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
              {user.companyDescription ||
                "No company description has been provided."}
            </p>

          </div>

        </div>

      </section>


      {/* Company Overview */}
      <section
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        <div className="mb-6 flex items-center gap-3">

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              bg-orange-100
              text-orange-600
              dark:bg-orange-500/10
              dark:text-orange-400
            "
          >
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              Organization Overview
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your CRM workspace information
            </p>
          </div>

        </div>


        <div className="grid gap-4 sm:grid-cols-2">

          <OverviewItem
            title="Organization"
            value={user.companyName}
          />

          <OverviewItem
            title="Workspace Role"
            value="Administrator"
          />

          <OverviewItem
            title="Lead Ownership"
            value="Company Leads"
          />

          <OverviewItem
            title="Account Status"
            value="Active"
          />

        </div>

      </section>


      {/* Account ID */}
      <section
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-5
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
          Account ID
        </p>

        <p className="mt-2 break-all font-mono text-sm text-gray-700 dark:text-gray-300">
          {user._id || user.id}
        </p>

      </section>

    </div>
  );
}


/* =========================
   Reusable Info Card
========================= */

function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex items-start
        gap-4
        rounded-xl
        border border-gray-200
        bg-gray-50
        p-5
        dark:border-gray-800
        dark:bg-gray-950
      "
    >

      <div className="mt-0.5 text-gray-500 dark:text-gray-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-gray-900 dark:text-white">
          {value || "Not provided"}
        </p>

      </div>

    </div>
  );
}


/* =========================
   Overview Item
========================= */

function OverviewItem({
  title,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border border-gray-200
        p-5
        dark:border-gray-800
      "
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <p className="mt-2 font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}


export default Profile;