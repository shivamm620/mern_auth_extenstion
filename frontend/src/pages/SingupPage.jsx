import { useState } from "react";
import Api from "../api/Api";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { setError, setLoading, setUser } from "../features/authSlice/authSlice";
import { useDispatch, useSelector } from "react-redux";
function SingupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const { data } = await Api.post("/singup", {
        name,
        username,
        email,
        password,
      });
      dispatch(setUser(data.data.user));
      console.log(data.data.user);

      toast.success(data.message);
      setEmail("");
      setName("");
      setUsername("");
      setPassword("");
      navigate("/resend_email");
    } catch (error) {
      const backendErrorMessage =
        error.response?.data?.message || "something went wrong";
      dispatch(setError(backendErrorMessage));
      toast.error(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type={"text"}
          name={"name"}
          placeholder={"Enter Your Name"}
        />
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type={"text"}
          name={"username"}
          placeholder={"Enter Your username"}
        />
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
          bntText={loading ? "loading .. " : "Sing Up"}
          onclick={handleSubmit}
          disabled={loading}
        />
      </form>
    </div>
  );
}

export default SingupPage;
