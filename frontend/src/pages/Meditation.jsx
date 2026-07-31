import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Meditation() {

  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [time, setTime] = useState(600); // 10 minutes
  const [running, setRunning] = useState(false);

  const musicRef = useRef(null);

  const meditations = [
    {
      id: "breathing",
      name: "Breathing Meditation",
      image: "breathing_meditation.png",
      instruction: "Close your eyes and take slow deep breaths. Focus only on your breathing."
    },
    {
      id: "nature",
      name: "Nature Meditation",
      image: "nature_meditation.png",
      instruction: "Imagine yourself sitting peacefully in nature. Listen to your breath and relax."
    },
    {
      id: "guided",
      name: "Guided Meditation",
      image: "guided_meditation.png",
      instruction: "Relax your body and follow calming thoughts. Let go of stress slowly."
    },
    {
      id: "sleep",
      name: "Sleep Meditation",
      image: "sleep_meditation.png",
      instruction: "Close your eyes and relax every muscle in your body."
    }
  ];

  useEffect(() => {

    let timer;

    if (running && time > 0) {
      timer = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }

    if (time === 0) {
      setRunning(false);

      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
    }

    return () => clearInterval(timer);

  }, [running, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // ---------------- Meditation Screen ----------------

  if (selectedMeditation) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>

        <audio ref={musicRef} loop>
          <source src="/music/calm_music.mp3" type="audio/mp3" />
        </audio>

        <h1>{selectedMeditation.name}</h1>

        <img
          src={`http://127.0.0.1:5000/images/${selectedMeditation.image}`}
          alt={selectedMeditation.name}
          style={{ width: "400px", borderRadius: "10px" }}
        />

        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          {selectedMeditation.instruction}
        </p>

        <div style={{ width: "160px", margin: "30px auto" }}>
          <CircularProgressbar
            value={time}
            maxValue={600}
            text={`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
            styles={buildStyles({
              textSize: "18px",
              pathColor: "#6c9cff",
              textColor: "#333",
              trailColor: "#eee"
            })}
          />
        </div>

        {!running && time > 0 && (
          <button
            onClick={() => {
              setRunning(true);
              if (musicRef.current) musicRef.current.play();
            }}
            style={{
              padding: "10px 25px",
              background: "#6c9cff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Start Meditation
          </button>
        )}

        {time === 0 && (
          <h2 style={{ color: "green", marginTop: "20px" }}>
            ✨ Meditation Completed!
          </h2>
        )}

        <br />

        <button
          onClick={() => {
            setSelectedMeditation(null);
            setRunning(false);
            setTime(600);

            if (musicRef.current) {
              musicRef.current.pause();
              musicRef.current.currentTime = 0;
            }
          }}
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            background: "#6c9cff",
            color: "white",
            cursor: "pointer"
          }}
        >
          ⬅ Back to Meditation List
        </button>

      </div>
    );
  }

  // ---------------- Meditation Cards ----------------

  return (
    <div style={{ padding: "40px" }}>

      <h1 style={{ textAlign: "center" }}>Meditation 🧘‍♀️</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: "30px",
          marginTop: "40px"
        }}
      >

        {meditations.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMeditation(m)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              background: "#fff"
            }}
          >

            <img
              src={`http://127.0.0.1:5000/images/${m.image}`}
              alt={m.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />

            <h3 style={{ marginTop: "15px" }}>{m.name}</h3>

          </div>
        ))}

      </div>

    </div>
  );
}