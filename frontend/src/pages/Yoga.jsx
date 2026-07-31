import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Yoga() {

  const [selectedPose, setSelectedPose] = useState(null);
  const [time, setTime] = useState(180);
  const [running, setRunning] = useState(false);

  const [sessionMode, setSessionMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const musicRef = useRef(null);

  const poses = [
    {
      id: "butterfly",
      name: "Butterfly Pose",
      image: "butterfly_pose.png",
      instruction: "Sit straight, bring feet together and gently move knees up and down."
    },
    {
      id: "child",
      name: "Child Pose",
      image: "child_pose.png",
      instruction: "Kneel down and stretch your arms forward while lowering your body."
    },
    {
      id: "cobra",
      name: "Cobra Pose",
      image: "cobra_pose.png",
      instruction: "Lie on your stomach and lift your chest upward using your hands."
    },
    {
      id: "catcow",
      name: "Cat Cow Pose",
      image: "cat_cow.png",
      instruction: "Start on hands and knees. Inhale arch your back, exhale round your spine slowly."
    },
    {
      id: "mountain",
      name: "Mountain Pose",
      image: "mountain_pose.png",
      instruction: "Stand tall with feet together and arms relaxed. Focus on breathing."
    },
    {
      id: "tree",
      name: "Tree Pose",
      image: "tree_pose.png",
      instruction: "Stand on one leg and place the other foot on the inner thigh. Balance and breathe."
    },
    {
      id: "triangle",
      name: "Triangle Pose",
      image: "triangle_pose.png",
      instruction: "Stand wide, stretch arms and bend sideways touching one foot."
    },
    {
      id: "bridge",
      name: "Bridge Pose",
      image: "bridge_pose.png",
      instruction: "Lie on your back, bend knees and lift hips upward."
    },
    {
      id: "forwardbend",
      name: "Seated Forward Bend",
      image: "seated_forward_bend.png",
      instruction: "Sit with legs straight and slowly bend forward touching your toes."
    }
  ];

  useEffect(() => {

    let timer;

    if (running && time > 0) {
      timer = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }

    if (running && time === 0 && sessionMode) {

      if (currentIndex < poses.length - 1) {

        const nextIndex = currentIndex + 1;

        if (musicRef.current) {
          musicRef.current.pause();
          musicRef.current.currentTime = 0;
        }

        setCurrentIndex(nextIndex);
        setSelectedPose(poses[nextIndex]);
        setTime(180);
        setRunning(false);

      } else {

        setRunning(false);

        if (musicRef.current) {
          musicRef.current.pause();
          musicRef.current.currentTime = 0;
        }

        alert("🎉 Yoga Session Completed!");

      }

    }

    return () => clearInterval(timer);

  }, [running, time, sessionMode, currentIndex]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // ---------------- Pose Screen ----------------
  if (selectedPose) {

    return (

      <div style={{ padding: "40px", textAlign: "center" }}>

        <audio ref={musicRef} loop>
          <source src="/music/calm_music.mp3" type="audio/mp3" />
        </audio>

        <h1>{selectedPose.name}</h1>

        <img
          src={`http://127.0.0.1:5000/images/${selectedPose.image}`}
          alt={selectedPose.name}
          style={{ width: "400px", borderRadius: "10px" }}
        />

        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          {selectedPose.instruction}
        </p>

        <div style={{ width: "150px", margin: "30px auto" }}>
          <CircularProgressbar
            value={time}
            maxValue={180}
            text={`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
            styles={buildStyles({
              textSize: "18px",
              pathColor: "#ff6b9a",
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
              padding: "10px 20px",
              marginTop: "20px",
              background: "#ff6b9a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Start Yoga
          </button>
        )}

        {time === 0 && !sessionMode && (
          <h2 style={{ color: "green" }}>✅ Yoga Completed!</h2>
        )}

        <br />

        <button
          onClick={() => {

            setSelectedPose(null);
            setTime(180);
            setRunning(false);
            setSessionMode(false);
            setCurrentIndex(0);

            if (musicRef.current) {
              musicRef.current.pause();
              musicRef.current.currentTime = 0;
            }

          }}
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ff6b9a",
            color: "white",
            cursor: "pointer"
          }}
        >
          ⬅ Back to Yoga List
        </button>

      </div>

    );
  }

  // ---------------- Yoga Cards ----------------
  return (

    <div style={{ padding: "40px" }}>

      <h1 style={{ textAlign: "center" }}>Yoga Exercises 🧘‍♀️</h1>

      <div style={{ textAlign: "center", marginTop: "20px" }}>

        <button
          onClick={() => {

            setSessionMode(true);
            setSelectedPose(poses[0]);
            setCurrentIndex(0);
            setTime(180);
            setRunning(false);

          }}
          style={{
            padding: "12px 25px",
            background: "#ff6b9a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Start Full Yoga Session
        </button>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: "30px",
          marginTop: "40px"
        }}
      >

        {poses.map((pose) => (

          <div
            key={pose.id}
            onClick={() => setSelectedPose(pose)}
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
              src={`http://127.0.0.1:5000/images/${pose.image}`}
              alt={pose.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />

            <h3 style={{ marginTop: "15px" }}>
              {pose.name}
            </h3>

          </div>

        ))}

      </div>

    </div>

  );
}