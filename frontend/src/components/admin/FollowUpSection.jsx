import {
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import leadService from "../../services/leadService";


function FollowUpSection() {

  const [today, setToday] =
    useState([]);

  const [upcoming, setUpcoming] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchFollowUps =
      async () => {

        try {

          const response =
            await leadService.getFollowUps();

          setToday(
            response.today || []
          );

          setUpcoming(
            response.upcoming || []
          );

        } catch (error) {

          console.error(
            "Failed to fetch follow-ups:",
            error
          );

        } finally {

          setLoading(false);

        }
      };


    fetchFollowUps();

  }, []);


  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">

        <Skeleton />

        <Skeleton />

      </div>
    );
  }


  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* Today's Follow-ups */}
      <FollowUpCard
        title="Today's Follow-ups"
        icon={
          <CalendarDays size={20} />
        }
        leads={today}
        emptyMessage="No follow-ups scheduled for today."
      />


      {/* Upcoming */}
      <FollowUpCard
        title="Upcoming Follow-ups"
        icon={
          <Clock3 size={20} />
        }
        leads={upcoming}
        emptyMessage="No upcoming follow-ups."
      />

    </div>
  );
}


function FollowUpCard({
  title,
  icon,
  leads,
  emptyMessage,
}) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        dark:border-gray-800
        dark:bg-gray-900
      "
    >

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
              dark:bg-blue-500/10
              dark:text-blue-400
            "
          >
            {icon}
          </div>

          <h2 className="font-bold text-gray-900 dark:text-white">
            {title}
          </h2>

        </div>

        <span
          className="
            rounded-full
            bg-gray-100
            px-2.5 py-1
            text-xs
            font-semibold
            text-gray-600
            dark:bg-gray-800
            dark:text-gray-400
          "
        >
          {leads.length}
        </span>

      </div>


      {leads.length === 0 ? (

        <div className="py-8 text-center">

          <CalendarDays
            size={30}
            className="mx-auto text-gray-300 dark:text-gray-700"
          />

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
            {emptyMessage}
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {leads.slice(0, 5).map(
            (lead) => (
              <Link
                key={lead._id}
                to={`/admin/leads/${lead._id}`}
                className="
                  block
                  rounded-xl
                  border
                  border-gray-200
                  p-4
                  transition
                  hover:border-blue-300
                  hover:bg-blue-50/50
                  dark:border-gray-800
                  dark:hover:border-blue-800
                  dark:hover:bg-blue-500/5
                "
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="min-w-0">

                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                      {lead.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-500">
                      {lead.company ||
                        lead.email}
                    </p>

                  </div>


                  <div className="shrink-0 text-right">

                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">

                      {new Date(
                        lead.followUpDate
                      ).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}

                    </p>

                    <p className="mt-1 text-[11px] uppercase text-gray-400">
                      {lead.status}
                    </p>

                  </div>

                </div>

              </Link>
            )
          )}


          {leads.length > 5 && (
            <Link
              to="/admin/leads"
              className="
                flex
                items-center
                justify-center
                gap-2
                pt-3
                text-sm
                font-semibold
                text-blue-600
                dark:text-blue-400
              "
            >
              View all
              <ArrowRight size={15} />
            </Link>
          )}

        </div>

      )}

    </section>
  );
}


function Skeleton() {
  return (
    <div
      className="
        h-72
        animate-pulse
        rounded-2xl
        bg-gray-200
        dark:bg-gray-800
      "
    />
  );
}


export default FollowUpSection;