import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Api from "../api/Api";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUser } from "../features/authSlice/authSlice";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const { data } = await Api.post("/singin", {
        email,
        password,
      });
      dispatch(setUser(data.data.user));
      console.log(data.data.user);
      toast.success(data.message);
      console.log(data);

      navigate("/user_profile");
      setEmail("");
      setPassword("");
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Something went wrong";

      dispatch(setError(backendMessage));
      toast.error(backendMessage);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
          name={"email"}
          placeholder={"Enter Your Email"}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={"password"}
          name={"password"}
          placeholder={"Enter Your Password"}
        />

        <Button
          type={"submit"}
          bntText={loading ? "loading" : "Sing In"}
          onclick={handleSubmit}
          disabled={loading}
        />
      </form>
    </div>
  );
}

export default LoginPage;
