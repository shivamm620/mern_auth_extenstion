import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { user, authChecked } = useSelector((state) => state.authReducer);
  if (!authChecked) return <div>Loading..</div>;
  if (!user) return <Navigate to="/singin" replace />;
  if (!user.role !== "admin") return <Navigate to="/404" replace />;
  return <div>{children}</div>;
}

export default AdminRoute;
