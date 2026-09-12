import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect } from "react";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./components/auth/Login";
import Dashboard from "./components/admin/Dashboard";
import Leads from "./components/admin/Leads";
import Analytics from "./components/admin/Analytics";
import NotFound from "./pages/NotFound";

import PublicContact from "./pages/PublicContact";
import Home from "./pages/Home";
import Admin from "./components/admin/Admin";

import useAuthStore from "./store/authStore";
import Profile from "./components/admin/Profile";

import LeadDetails from "./components/admin/LeadDetails";
import LeadImport from "./components/admin/LeadImport";

import Register from "./components/auth/Register";

import PublicHomeRoute from "./components/auth/PublicHomeRoute";


function App() {

  const loadUser = useAuthStore(
    (state) => state.loadUser
  );

  useEffect(() => {
    loadUser();
  }, [loadUser]);


  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <PublicHomeRoute>
              <Home />
            </PublicHomeRoute>
          }
        />

        <Route
          path="/contact"
          element={<PublicContact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Admin />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="leads"
            element={<Leads />}
          />

          <Route
            path="leads/import"
            element={<LeadImport />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />
          <Route
            path="profile"
            element={<Profile />}
          />
          <Route
            path="leads/:id"
            element={<LeadDetails />}
          />

        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;