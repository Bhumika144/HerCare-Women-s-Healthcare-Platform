import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function GeneralExercise() {

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [time, setTime] = useState(180);
  const [running, setRunning] = useState(false);

  const musicRef = useRef(null);

  const exercises = [
    {
      id: "jumping",
      name: "Jumping Jacks",
      image: "jumping_jacks.png",
      instruction: "Jump while spreading your legs and raising your arms."
    },
    {
      id: "squats",
      name: "Bodyweight Squats",
      image: "squats_exercise.png",
      instruction: "Stand straight and slowly bend knees like sitting on a chair."
    },
    {
      id: "armcircles",
      name: "Arm Circles",
      image: "arm_circles.png",
      instruction: "Stretch arms sideways and rotate them in circles."
    },
    {
      id: "highknees",
      name: "High Knees",
      image: "high_knees.png",
      instruction: "Run in place lifting your knees as high as possible."
    },
    {
      id: "sidestretch",
      name: "Standing Side Stretch",
      image: "side_stretch.png",
      instruction: "Stand straight and stretch your body sideways."
    },
    {
      id: "wallpush",
      name: "Wall Push Ups",
      image: "wall_pushups.png",
      instruction: "Stand facing a wall and perform push ups against it."
    },
    {
      id: "marching",
      name: "Marching in Place",
      image: "marching_place.png",
      instruction: "Lift knees one by one while marching in the same place."
    },
    {
      id: "toetouch",
      name: "Standing Toe Touch",
      image: "standing_toe_touch.png",
      instruction: "Stand straight and bend down to touch your toes."
    },
    {
      id: "shoulder",
      name: "Shoulder Rolls",
      image: "shoulder_rolls.png",
      instruction: "Roll your shoulders slowly forward and backward."
    },
    {
      id: "sideleg",
      name: "Side Leg Raise",
      image: "side_leg_raise.png",
      instruction: "Stand straight and lift one leg sideways slowly."
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
        General Exercises 💪
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