import "./App.css";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import SingupPage from "./pages/SingupPage";
import HomePage from "./pages/HomePage";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import {
  setAuthChecked,
  setError,
  setLoading,
  setUser,
} from "./features/authSlice/authSlice";
import { useDispatch } from "react-redux";
import Api from "./api/Api";
import EmailVerify from "./pages/EmailVerify";
import Resend_Email_Verification from "./pages/Resend_Email_Verification";
import NotFound from "./pages/NotFound";
import AdminRoute from "./pages/AdminRoute";
import AdminDashBoard from "./pages/AdminDashBoard";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const autoLogin = async () => {
      const { accessToken, refreshToken } = await chrome.storage.local.get([
        "accessToken",
        "refreshToken",
      ]);
      try {
        const { data } = await Api.get("/auto", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (data?.data?.user) {
          console.log(data?.data?.user);

          dispatch(setUser(data.data.user));
        }
      } catch (error) {
        dispatch(setError(null));
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    autoLogin();
  }, []);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email/:token" element={<EmailVerify />} />
        <Route path="/singin" element={<LoginPage />} />
        <Route
          path="/user_profile"
          element={
            <ProtectedRoutes>
              <ProfilePage />
            </ProtectedRoutes>
          }
        />
        <Route path="/singup" element={<SingupPage />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashBoard />
            </AdminRoute>
          }
        />
        <Route path="/resend_email" element={<Resend_Email_Verification />} />
      </Routes>
    </>
  );
}

export default App;
