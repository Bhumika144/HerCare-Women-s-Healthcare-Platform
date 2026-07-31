import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboard.css";

export default function Onboarding() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    displayName: "",
    age: "",
    lastPeriodDate: "",
    periodRegular: "",
    cycleLength: "",
    medicalIssues: []
  });

  const next = () => setStep(step + 1);

  const submit = async () => {
    await fetch("http://localhost:5000/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        ...formData
      })
    });

    navigate("/dashboard");
  };

  return (
    <div className="onboard-container">
      <div className="card">

        <h2>Let’s personalize your care 💖</h2>
        <p className="step">Step {step} of 6</p>

        {step === 1 && (
          <>
            <h3>What should we call you? 💖</h3>
            <input
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
            <button onClick={next}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>How old are you?</h3>
            <input
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
            <button onClick={next}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>When did your last period start?</h3>
            <input
              type="date"
              onChange={(e) =>
                setFormData({ ...formData, lastPeriodDate: e.target.value })
              }
            />
            <button onClick={next}>Next</button>
          </>
        )}

        {step === 4 && (
          <>
            <h3>Are your periods regular?</h3>
            <button onClick={() => {
              setFormData({ ...formData, periodRegular: "regular" });
              next();
            }}>Regular</button>

            <button onClick={() => {
              setFormData({ ...formData, periodRegular: "irregular" });
              next();
            }}>Irregular</button>
          </>
        )}

        {step === 5 && (
          <>
            <h3>Cycle length?</h3>
            <input
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, cycleLength: e.target.value })
              }
            />
            <button onClick={next}>Next</button>
          </>
        )}

        {step === 6 && (
          <>
            <h3>Any medical issues?</h3>
            <button onClick={submit}>Finish</button>
          </>
        )}

      </div>
    </div>
  );
}