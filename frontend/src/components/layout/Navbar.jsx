import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

import ThemeToggle from "../common/ThemeToggle";
import useAuthStore from "../../store/authStore";

function Navbar({ onMenuClick = () => {} }) {
  const { user } =
    useAuthStore();

  return (
    <header className="
      sticky top-0 z-30
      flex h-20
      items-center justify-between
      gap-3
      border-b
      border-slate-200
      bg-white/80
      px-4 backdrop-blur
      dark:border-slate-800
      dark:bg-slate-900/80
      sm:px-6 lg:px-8
    ">

      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-xl
            text-slate-500
            hover:bg-slate-100
            dark:text-slate-400
            dark:hover:bg-slate-800
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h2 className="
            truncate text-lg font-semibold
          ">
            Client Management
          </h2>

          <p className="
            hidden text-xs
            text-slate-500
            dark:text-slate-400
            sm:block
          ">
            Manage your business leads
          </p>
        </div>
      </div>

      <div className="
        flex shrink-0 items-center gap-2 sm:gap-3
      ">
        <button className="
          relative flex h-10 w-10
          items-center justify-center
          rounded-xl
          text-slate-500
          hover:bg-slate-100
          dark:hover:bg-slate-800
        ">
          <Bell size={19} />

          <span className="
            absolute right-2 top-2
            h-2 w-2 rounded-full
            bg-red-500"
          />
        </button>

        <ThemeToggle />

        <div className="
          hidden items-center gap-2
          border-l border-slate-200
          pl-3 sm:flex
          dark:border-slate-700
        ">
          <div className="
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-indigo-100
            font-semibold
            text-indigo-600
            dark:bg-indigo-500/10
            dark:text-indigo-400
          ">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>
            <p className="
              text-sm font-medium
            ">
              {user?.name}
            </p>

            <p className="
              text-xs
              text-slate-500
              dark:text-slate-400
            ">
              Admin
            </p>
          </div>

          <ChevronDown
            size={16}
            className="
              text-slate-400
            "
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;