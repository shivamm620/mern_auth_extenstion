import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Api from "../api/Api";
import { toast } from "react-toastify";
import Input from "../components/Input";
import { setLoading } from "../features/authSlice/authSlice";
import Button from "../components/Button";

function Resend_Email_Verification() {
  const { user, loading } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  console.log(user);
  const [coolDown, setCoolDown] = useState(60);
  const handleResend = async () => {
    if (coolDown > 0) return;
    dispatch(setLoading(true));
    try {
      console.log(email);

      if (!user) {
        const { data } = await Api.post("/resend-email", {
          email,
        });
        toast.success(data.message);
      } else {
        const { data } = await Api.post("/resend-email", {
          email: user.email,
        });
        toast.success(data.message);
      }

      setCoolDown(60);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (user?.isVerified) {
      console.log();

      navigate("/user_profile");
    }
    let timer;
    if (coolDown > 0) {
      timer = setTimeout(() => setCoolDown(coolDown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [user, coolDown]);
  return (
    <div>
      {user?.isVerified ? (
        <h1>You Already Login</h1>
      ) : (
        <div>
          <h1>Please Check Your Email</h1>
          {!user ? (
            <div>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type={"email"}
                name={"email"}
                placeholder={"Enter Your Email"}
              />
              <Button
                type={"submit"}
                bntText={
                  loading
                    ? "Sending Mail.. Check Your Email"
                    : ` Resend Email Verification code ${
                        coolDown === 0 ? "" : coolDown
                      }`
                }
                onclick={handleResend}
                disabled={coolDown > 0 || loading}
              />
            </div>
          ) : (
            <Button
              type={"submit"}
              bntText={
                loading
                  ? "Sending Mail.. Check Your Email"
                  : ` Resend Email Verification code ${
                      coolDown === 0 ? "" : coolDown
                    }`
              }
              onclick={handleResend}
              disabled={coolDown > 0 || loading}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Resend_Email_Verification;
