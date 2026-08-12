import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function EmotionTracker() {
  const webcamRef = useRef(null);

  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.email;

  const detectEmotion = async () => {
    if (!webcamRef.current) {
      console.log("Webcam not ready");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      console.log("Could not capture webcam image");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Sending image to Flask...");

      const response = await axios.post(
        "http://127.0.0.1:5000/emotion-detect",
        {
          image: imageSrc,
          email: email,
        }
      );

      console.log("EMOTION API RESPONSE:", response.data);

      setEmotion(response.data.emotion);
      setConfidence(response.data.confidence);
      setRecommendation(response.data.recommendation);

    } catch (error) {
      console.error("Emotion detection error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);
      }

      setError("Unable to detect emotion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      detectEmotion();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#fff8f5",
      }}
    >
      <h1>🧠 Emotion Wellness Tracker</h1>

      <p>
        Your emotion is analyzed using the webcam and DeepFace AI.
      </p>

      {/* Webcam */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={500}
          videoConstraints={{
            facingMode: "user",
          }}
          onUserMedia={() => {
            console.log("Webcam started");
            setTimeout(() => {
              detectEmotion();
            }, 1000);
          }}
        />
      </div>

      {/* Detect Button */}
      <button
        onClick={detectEmotion}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Detecting..." : "Detect My Emotion"}
      </button>

      {/* Result */}
      <div
        style={{
          marginTop: "30px",
          padding: "25px",
          borderRadius: "15px",
          background: "white",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "500px",
        }}
      >
        <h2>What is my emotion?</h2>

        {emotion ? (
          <>
            <h1 style={{ textTransform: "capitalize" }}>
              😊 {emotion}
            </h1>

            <h3>
              Confidence:{" "}
              {confidence !== null
                ? `${Number(confidence).toFixed(2)}%`
                : "--"}
            </h3>

            <hr />

            <h3>💗 Wellness Recommendation</h3>

            <p>{recommendation}</p>
          </>
        ) : (
          <p>
            {loading
              ? "Analyzing your emotion..."
              : "Waiting for emotion detection..."}
          </p>
        )}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default EmotionTracker;