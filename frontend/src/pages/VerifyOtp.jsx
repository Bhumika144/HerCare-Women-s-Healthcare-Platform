import { useState } from "react";
import api from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/VerifyOtp.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const verifyOtp = async () => {
    try {
      // Send OTP to backend
      const res = await api.post("/verify-otp", {
        email: state.email,
        otp: otp
      });

      console.log("✅ Verification response:", res.data);

      // Save user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.name,
          email: res.data.email,
          onboarding_completed:
            res.data.onboarding_completed || false
        })
      );

      // Redirect based on onboarding status
      if (res.data.onboarding_completed) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }

    } catch (error) {
      console.error("❌ OTP Verification Error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "OTP verification failed"
        );
      } else {
        alert("Cannot connect to the server");
      }
    }
  };

  return (
    <div className="otp-container">
      <form
        className="otp-form"
        onSubmit={(e) => {
          e.preventDefault();
          verifyOtp();
        }}
      >
        <h2>Enter OTP 💌</h2>

        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <button type="submit">
          Verify
        </button>
      </form>
    </div>
  );
}