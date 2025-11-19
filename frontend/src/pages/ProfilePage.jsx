import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { setError, setLogout, setUser } from "../features/authSlice/authSlice";
import Api from "../api/Api";
import { useEffect } from "react";
function ProfilePage() {
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const { data } = await Api.post("/logout");
      dispatch(setLogout());
      toast.success(data.message);
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
      toast.error(error.response?.data?.message);
    }
  };
  const handleAllLogout = async () => {
    try {
      const { data } = await Api.post("/all-logout");
      dispatch(setLogout());
      toast.success(data.message);
    } catch (error) {
      dispatch(setError(error.response?.data?.message));
      toast.error(error.response?.data?.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await Api.get("/profile");
        dispatch(setUser(data.data));
      } catch (error) {
        dispatch(setError(error));
      }
    };
    fetchData();
  }, [dispatch]);
  return (
    <div>
      <ul>
        <li>{user.username}</li>
        <li>{user.name}</li>
        <li>{user.email}</li>
        <li>{user.role}</li>
      </ul>
      <Button type="button" onclick={handleLogout} bntText="Logout" />
      <Button
        type="button"
        onclick={handleAllLogout}
        bntText="Logout from All Device"
      />
    </div>
  );
}

export default ProfilePage;
