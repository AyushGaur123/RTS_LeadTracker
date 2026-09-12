import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";
import FollowUpSection from "./FollowUpSection";
import imageA from '../../assets/imageA.avif';
import imageB from '../../assets/imageB.avif';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function Admin() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-400"
        >
          Loading dashboard...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">

      {/* =====================================================
          HERO / INTRO SECTION
      ====================================================== */}
      <section className="relative min-h-[600px] overflow-hidden rounded-[2rem] border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-xl dark:border-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">

        {/* Background blobs */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
        />

        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative z-10 grid min-h-[600px] items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:px-12 lg:py-16">

          {/* =================================================
              LEFT SIDE - TEXT
          ================================================== */}
          <div className="max-w-2xl">

            {/* Small badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur dark:border-blue-500/20 dark:bg-gray-900/60 dark:text-blue-400"
            >
              <Sparkles size={16} />

              <span>Your CRM Workspace</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="text-4xl font-black leading-[1.1] tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {getGreeting()},
              <span className="mt-2 block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {user.name} 👋
              </span>
            </motion.h1>

            {/* Animated secondary heading */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.35,
              }}
              className="mt-6"
            >
              <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-100 sm:text-3xl">
                Turn every lead into
                <span className="text-blue-600 dark:text-blue-400">
                  {" "}a relationship.
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.5,
              }}
              className="mt-5 max-w-xl text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg"
            >
              Keep your leads organized, stay on top of follow-ups,
              build stronger customer relationships, and move your
              opportunities forward — all from one place.
            </motion.p>

            {/* Small stats */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.7,
              }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                <Users
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Manage Leads
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                <TrendingUp
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Grow Faster
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                <CheckCircle2
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Stay Organized
                </span>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              RIGHT SIDE - IMAGES
          ================================================== */}
          <div className="relative mx-auto h-[260px] w-full max-w-[540px] sm:h-[340px] lg:h-[420px]">

            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.03,
              }}
              className="absolute right-0 top-6 z-20 w-[75%] overflow-hidden rounded-3xl border-8 border-white shadow-2xl dark:border-gray-800"
            >
              <img
                src={imageA}
                alt="Business team meeting"
                className="h-[170px] w-full object-cover sm:h-[220px] lg:h-[280px]"
              />

              {/* image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4">
                <p className="text-sm font-semibold text-white">
                  Better teamwork
                </p>

                <p className="text-xs text-white/80">
                  One workspace for your team
                </p>
              </div>
            </motion.div>

            {/* Secondary image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, x: -50, y: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.6,
                ease: "easeOut",
              }}
              className="absolute bottom-2 left-0 z-30 w-[55%] overflow-hidden rounded-3xl border-8 border-white shadow-2xl dark:border-gray-800"
            >
              <img
                src={imageB}
                alt="Team collaboration"
                className="h-[135px] w-full object-cover sm:h-[175px] lg:h-[220px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4">
                <p className="text-sm font-semibold text-white">
                  Strong relationships
                </p>
              </div>
            </motion.div>

            {/* Floating dashboard card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: [0, -12, 0],
                scale: 1,
              }}
              transition={{
                opacity: {
                  duration: 0.6,
                  delay: 1,
                },
                scale: {
                  duration: 0.6,
                  delay: 1,
                },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute right-1 bottom-0 z-40 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/95"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <TrendingUp size={22} />
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Lead Progress
                  </p>

                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    Growing 🚀
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating decorative circle */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[45%] top-0 z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl"
            >
              <Users size={25} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOLLOW-UP SECTION
          EXACTLY TWO CARDS
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.4,
        }}
      >
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Follow-ups
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stay on top of your customer conversations.
              </p>
            </div>
          </div>
        </div>

        {/* Existing FollowUpSection */}
        <FollowUpSection />
      </motion.section>
    </div>
  );
}

export default Admin;