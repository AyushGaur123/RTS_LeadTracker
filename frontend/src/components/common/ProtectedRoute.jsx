import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import PageSkeleton from "./PageSkeleton";

function ProtectedRoute({ children }) {
  const {
    token,
    initialized,
  } = useAuthStore();

  if (!initialized) {
    return <PageSkeleton />;
  }

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;