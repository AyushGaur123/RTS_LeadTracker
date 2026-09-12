import { LayoutDashboard, Users, BarChart3, LogOut, X, Handshake, UploadCloud,} from "lucide-react";

import { NavLink } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const links = [
  { name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    path: "/admin/leads",
    icon: Users,
  },
  {
    name: "Import Leads",
    path: "/admin/leads/import",
    icon: UploadCloud,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name:"Profile",
    path:"/admin/profile",
    icon:Users,
  }
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { logout } = useAuthStore();

  return (
    <>
      {/* Mobile backdrop — click to close the drawer */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`
          fixed inset-0
          z-40
          bg-slate-900/50
          transition-opacity
          lg:hidden
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside className={`
        fixed left-0 top-0
        z-50 flex h-screen
        w-64 flex-col
        border-r
        border-slate-200
        bg-white
        transition-transform duration-300 ease-in-out
        dark:border-slate-800
        dark:bg-slate-900
        lg:z-40 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >

        <div className="
          flex h-20 shrink-0
          items-center justify-between
          border-b
          border-slate-200
          px-6
          dark:border-slate-800
        ">
          <div className="
            flex items-center gap-3
          ">
            <div className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              bg-indigo-600
              font-bold text-white
            ">
             <Handshake size={20} />
            </div>

            <div>
              <h1 className="
                font-bold
              ">
              <a href="/admin">LeadNova</a>
                
              </h1>

              <p className="
                text-xs
                text-slate-500
                dark:text-slate-400
              ">
                Client CRM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-slate-500
              hover:bg-slate-100
              dark:text-slate-400
              dark:hover:bg-slate-800
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
        <p className="
          mb-3 px-3
          text-xs font-semibold
          uppercase tracking-wider
          text-slate-400
        ">
          Menu
        </p>

        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  rounded-xl px-3 py-3
                  text-sm font-medium
                  transition
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }
                  `
                }
              >
                <Icon size={19} />

                {link.name}
              </NavLink>
            );
          })}
        </div>
        </nav>

        <div className="
        shrink-0
        border-t
        border-slate-200
        p-4
        dark:border-slate-800
      ">
        <button
          onClick={logout}
          className="
            flex w-full
            items-center gap-3
            rounded-xl px-3 py-3
            text-sm font-medium
            text-red-500
            transition
            hover:bg-red-50
            dark:hover:bg-red-500/10
          "
        >
          <LogOut size={19} />

          Logout
        </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;