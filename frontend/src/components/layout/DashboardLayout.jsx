import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer automatically whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="
      min-h-screen
      bg-slate-100
      text-slate-900
      dark:bg-slate-950
      dark:text-slate-100
    ">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="
        lg:ml-64
      ">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="
          min-w-0
          p-4 sm:p-6 lg:p-8
        ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;