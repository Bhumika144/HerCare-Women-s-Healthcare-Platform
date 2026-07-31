import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function PeriodExercise() {

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [time, setTime] = useState(180);
  const [running, setRunning] = useState(false);

  const musicRef = useRef(null);

  const exercises = [
    {
      id: "childpose",
      name: "Child Pose",
      image: "period_child_pose.png",
      instruction: "Kneel down and stretch your arms forward. Relax your stomach and breathe slowly."
    },
    {
      id: "catcow",
      name: "Cat Cow Stretch",
      image: "period_cat_cow.png",
      instruction: "Start on hands and knees. Inhale arch your back and exhale round your spine."
    },
    {
      id: "kneechest",
      name: "Knee to Chest Stretch",
      image: "knee_to_chest_stretch.png",
      instruction: "Lie on your back and gently pull your knees toward your chest."
    },
    {
      id: "twist",
      name: "Supine Spinal Twist",
      image: "supine_spinal_twist.png",
      instruction: "Lie on your back and slowly twist your knees to one side."
    },
    {
      id: "bridge",
      name: "Bridge Pose",
      image: "period_bridge_pose.png",
      instruction: "Lie on your back, bend your knees and lift your hips slowly."
    },
    {
      id: "butterfly",
      name: "Butterfly Stretch",
      image: "butterfly_stretch.png",
      instruction: "Sit straight, bring feet together and move knees gently up and down."
    },
    {
      id: "pelvic",
      name: "Pelvic Tilt",
      image: "pelvic_tilt.png",
      instruction: "Lie on your back and slowly tilt your pelvis upward."
    },
    {
      id: "forwardbend",
      name: "Seated Forward Bend",
      image: "seated_forward_bend_period.png",
      instruction: "Sit with legs straight and slowly bend forward to reach your toes."
    },
    {
      id: "legsup",
      name: "Legs Up The Wall",
      image: "legs_up_wall_pose.png",
      instruction: "Lie down and place your legs vertically against a wall."
    }
  ];

  useEffect(() => {

    let timer;

    if (running && time > 0) {
      timer = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);

  }, [running, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (selectedExercise) {

    return (

      <div style={{ padding: "40px", textAlign: "center" }}>

        <audio ref={musicRef} loop>
          <source src="/music/calm_music.mp3" type="audio/mp3" />
        </audio>

        <h1>{selectedExercise.name}</h1>

        <img
          src={`http://127.0.0.1:5000/static/images/${selectedExercise.image}`}
          alt={selectedExercise.name}
          style={{ width: "400px", borderRadius: "10px" }}
        />

        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          {selectedExercise.instruction}
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
              background: "#ff6b9a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Start Exercise
          </button>
        )}

        <br />

        <button
          onClick={() => {
            setSelectedExercise(null);
            setRunning(false);
            setTime(180);

            if (musicRef.current) {
              musicRef.current.pause();
              musicRef.current.currentTime = 0;
            }
          }}
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ff6b9a",
            color: "white",
            cursor: "pointer"
          }}
        >
          ⬅ Back
        </button>

      </div>

    );
  }

  return (

    <div style={{ padding: "40px" }}>

      <h1 style={{ textAlign: "center" }}>
        Period Relief Exercises 🌸
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: "30px",
          marginTop: "40px"
        }}
      >

        {exercises.map((ex) => (

          <div
            key={ex.id}
            onClick={() => setSelectedExercise(ex)}
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
              src={`http://127.0.0.1:5000/static/images/${ex.image}`}
              alt={ex.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />

            <h3 style={{ marginTop: "15px" }}>
              {ex.name}
            </h3>

          </div>

        ))}

      </div>

    </div>

  );
}