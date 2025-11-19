import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const { user, authChecked } = useSelector((state) => state.authReducer);
  if (!authChecked) return <div>Loading...</div>;
  if (!user) return <Navigate to="/singin" replace />;
  return children;
}

export default ProtectedRoutes;
