import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setError, setLoading, setUser } from "../features/authSlice/authSlice";
import Api from "../api/Api";
import { toast } from "react-toastify";

function EmailVerify() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setLoading());
    const verifing = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await Api.get(`/verfiy-email/${token}`);
        dispatch(setUser(data.data.user));
        navigate("/user_profile");
      } catch (error) {
        dispatch(setError(error.response?.data?.message || "Invalid token"));
        toast.error(error.response?.data?.message || "Invalid token");
      }
    };
    verifing();
  }, [token]);
  return (
    <div>
      <h1>Verifing Your Email.....</h1>
    </div>
  );
}

export default EmailVerify;
