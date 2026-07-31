import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api";
import "../styles/period_tracker.css";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function PeriodTracker() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [periodDates, setPeriodDates] = useState([]);
  const [predictedDate, setPredictedDate] = useState("");
  const [predictedDays, setPredictedDays] = useState([]);
  const [message, setMessage] = useState("");

  const [flow, setFlow] = useState("");
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState([]);

  const [aiData, setAiData] = useState({
    whats: "",
    tips: [],
    care: ""
  });

  const [phase, setPhase] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  const fetchData = async () => {
    try {
      const res = await api.get(`/period-dates/${user.email}`);
      setPeriodDates(res.data.period_dates || []);
      setPredictedDays(res.data.predicted_period_days || []);

      const profileRes = await api.get(`/dashboard/${user.email}`);
      const next = profileRes.data.next_predicted_period;

      setPredictedDate(next || "");
      calculatePhase(next);
    } catch (err) {
      console.log(err);
    }
  };

  // 🧠 Phase calculation
  const calculatePhase = (nextDate) => {
    if (!nextDate) return;

    const today = new Date();
    const next = new Date(nextDate);

    const diff = Math.floor((next - today) / (1000 * 60 * 60 * 24));

    if (diff <= 5) setPhase("Menstrual 🩸");
    else if (diff <= 13) setPhase("Follicular 🌱");
    else if (diff <= 16) setPhase("Ovulation 🔥");
    else setPhase("Luteal 🌙");
  };

  const toggleSymptom = (sym) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter((s) => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  // 🤖 AI call
  const generateSuggestion = async () => {
    try {
      const res = await api.post("/ai-suggestions", {
        symptoms,
        mood,
        flow
      });

      const text = res.data.suggestion || "";

      const parts = text.split("\n\n");

      setAiData({
        whats: parts[0] || "",
        tips: parts[1] ? parts[1].split("\n") : [],
        care: parts[2] || ""
      });
    } catch (err) {
      console.log(err);
    }
  };

  const logPeriod = async (date) => {
    const formatted = formatDate(date);

    try {
      const res = await api.post("/log-period", {
        email: user.email,
        newPeriodDate: formatted,
        symptom: symptoms.join(", ")
      });

      setMessage("Logged successfully 🌸");

      setPeriodDates(res.data.period_dates);
      setPredictedDate(res.data.next_period);
      setPredictedDays(res.data.predicted_period_days || []);

      calculatePhase(res.data.next_period);

      // 🔥 Auto AI after logging
      await generateSuggestion();

    } catch (err) {
      console.log(err);
      setMessage("Something went wrong ❌");
    }
  };

  const getTileClass = ({ date }) => {
    const formatted = formatDate(date);

    if (periodDates.includes(formatted)) return "period-day";

    if (predictedDays.includes(formatted)) {
      if (formatted === predictedDays[0]) return "predicted-start";
      if (formatted === predictedDays[predictedDays.length - 1])
        return "predicted-end";
      return "predicted-day";
    }

    return "";
  };

  // 📈 Chart Data
  const chartData = periodDates
    .map((date, index) => {
      if (index === 0) {
        return {
          cycle: `Cycle ${index + 1}`,
          days: 0
        };
      }

      const prev = new Date(periodDates[index - 1]);
      const current = new Date(date);

      const diff = Math.floor(
        (current - prev) / (1000 * 60 * 60 * 24)
      );

      return {
        cycle: `Cycle ${index + 1}`,
        days: diff
      };
    })
    .filter((item) => item.days > 0);

  const isRegular =
    chartData.length > 0
      ? Math.max(...chartData.map((d) => d.days)) -
          Math.min(...chartData.map((d) => d.days)) <= 5
      : false;

  return (
    <div className="tracker-container">
      <h2>🌸 Period Tracker</h2>

      {message && <p className="success-msg">{message}</p>}

      {/* 💎 TOP CARD */}
      <div className="premium-card">
        <h3>Next Period</h3>
        <p>{predictedDate || "Calculating..."}</p>

        {phase && (
          <span className="phase-badge">
            {phase}
          </span>
        )}
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="tracker-grid">

        {/* 📅 CALENDAR */}
        <div className="calendar-section">
          <Calendar
            onClickDay={logPeriod}
            tileClassName={getTileClass}
          />
        </div>

        {/* 💖 SYMPTOMS */}
        <div className="symptom-card">

          <h3>🩺 Log Your Symptoms</h3>

          <p className="section-title">💧 Flow</p>

          <div className="pill-row">
            {["Light", "Medium", "Heavy"].map((f) => (
              <button
                key={f}
                className={`pill ${flow === f ? "active" : ""}`}
                onClick={() => setFlow(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="section-title">😊 Mood</p>

          <div className="pill-row">
            {["Happy 😊", "Neutral 😐", "Low 😔"].map((m) => (
              <button
                key={m}
                className={`pill ${mood === m ? "active" : ""}`}
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <p className="section-title">⚡ Symptoms</p>

          <div className="pill-row">
            {["Cramps", "Headache", "Bloating", "Fatigue"].map((s) => (
              <button
                key={s}
                className={`pill ${
                  symptoms.includes(s) ? "active" : ""
                }`}
                onClick={() => toggleSymptom(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="ai-btn"
            onClick={generateSuggestion}
          >
            🤖 Get Smart Suggestions
          </button>

          {/* 🤖 AI OUTPUT */}
          {aiData.whats && (
            <div className="ai-cards">

              <div className="ai-card">
                <h4>🌸 What's happening</h4>
                <p>{aiData.whats}</p>
              </div>

              <div className="ai-card">
                <h4>💡 Tips</h4>

                {aiData.tips.map((tip, i) => (
                  <p key={i}>{tip}</p>
                ))}
              </div>

              <div className="ai-card">
                <h4>💖 Care</h4>
                <p>{aiData.care}</p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* 📈 CHART SECTION */}
      <div className="chart-card">

        <div className="chart-header">
          <h3>📈 Cycle Regularity Analysis</h3>

          <span className="chart-badge">
            {chartData.length > 0
              ? isRegular
                ? "Regular 🌸"
                : "Irregular ⚠️"
              : "Not enough data"}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>

            <defs>
              <linearGradient
                id="colorCycle"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#ff4d8d"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="#ff4d8d"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.1}
            />

            <XAxis dataKey="cycle" />

            <YAxis
              label={{
                value: "Days",
                angle: -90,
                position: "insideLeft"
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="days"
              stroke="#ff4d8d"
              fillOpacity={1}
              fill="url(#colorCycle)"
              strokeWidth={4}
            />

            <Line
              type="monotone"
              dataKey="days"
              stroke="#ff4d8d"
              strokeWidth={3}
              dot={{
                r: 6,
                fill: "#fff",
                stroke: "#ff4d8d",
                strokeWidth: 3
              }}
              activeDot={{
                r: 8
              }}
            />

          </AreaChart>
        </ResponsiveContainer>

        <p className="chart-note">
          Healthy menstrual cycles usually range between
          <strong> 21–35 days</strong>.
        </p>

      </div>
    </div>
  );
}