import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "../styles/EmotionTracker.css";

function EmotionTracker() {
  const webcamRef = useRef(null);

  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [webcamReady, setWebcamReady] = useState(false);
  const [userMood, setUserMood] = useState("");
  const [moodSubmitted, setMoodSubmitted] = useState(false);
  const [comparisonMessage, setComparisonMessage] = useState("");
  const [detectionAttempts, setDetectionAttempts] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.email;

  // =========================
  // UNIFIED EMOTION/MOOD MAPPINGS
  // =========================

  const emotionMap = {
    happy: { 
      label: "Happy", 
      icon: "😊", 
      color: "#ff6b9a",
      recommendation: "Keep up your positive energy 💖"
    },
    sad: { 
      label: "Sad", 
      icon: "😢", 
      color: "#3498db",
      recommendation: "Try a 5-minute meditation session 🧘"
    },
    angry: { 
      label: "Angry", 
      icon: "😠", 
      color: "#e74c3c",
      recommendation: "Take a deep breathing exercise 🌸"
    },
    fear: { 
      label: "Fear", 
      icon: "😨", 
      color: "#9b59b6",
      recommendation: "Listen to calming music 🎵"
    },
    neutral: { 
      label: "Neutral", 
      icon: "😐", 
      color: "#95a5a6",
      recommendation: "Stay hydrated and active 💧"
    },
    surprise: { 
      label: "Surprise", 
      icon: "😮", 
      color: "#f39c12",
      recommendation: "Take a moment to relax 🌼"
    },
    disgust: { 
      label: "Disgust", 
      icon: "🤢", 
      color: "#27ae60",
      recommendation: "Take some time to relax and care for yourself 🌷"
    }
  };

  // Same emotions for user mood input - matching AI emotions
  const userMoods = {
    happy: { label: "Happy", icon: "😊" },
    sad: { label: "Sad", icon: "😢" },
    angry: { label: "Angry", icon: "😠" },
    fear: { label: "Fear", icon: "😨" },
    neutral: { label: "Neutral", icon: "😐" },
    surprise: { label: "Surprise", icon: "😮" },
    disgust: { label: "Disgust", icon: "🤢" }
  };

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

      const detectedEmotion = response.data.emotion?.toLowerCase() || "";
      const emotionData = emotionMap[detectedEmotion] || emotionMap.neutral;
      
      setEmotion(detectedEmotion);
      setConfidence(response.data.confidence);
      setRecommendation(emotionData.recommendation);
      setDetectionAttempts(0);
      
      // Compare with user mood if submitted
      if (moodSubmitted) {
        compareMoods(detectedEmotion, userMood);
      }

    } catch (error) {
      console.error("Emotion detection error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);
      }

      setError("Unable to detect emotion. Please try again.");
      setDetectionAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const compareMoods = (detectedEmotion, userMood) => {
    const detectedLower = detectedEmotion?.toLowerCase() || "";
    const userLower = userMood?.toLowerCase() || "";

    // Direct match check
    if (detectedLower === userLower) {
      setComparisonMessage("✅ Great! Your mood matches what AI detected. You're in tune with your emotions!");
    } else {
      setComparisonMessage("🔄 Your mood and AI detection are different. Let's take a closer look...");
    }
  };

  useEffect(() => {
    let interval;
    if (webcamReady) {
      interval = setInterval(() => {
        detectEmotion();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [webcamReady, moodSubmitted, userMood]);

  const handleMoodSubmit = () => {
    if (userMood.trim()) {
      setMoodSubmitted(true);
      // Compare immediately if emotion already detected
      if (emotion) {
        compareMoods(emotion, userMood);
      }
    }
  };

  // Get emotion data
  const getEmotionData = (emotionKey) => {
    return emotionMap[emotionKey?.toLowerCase()] || emotionMap.neutral;
  };

  return (
    <div className="emotion-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="emotion-page-header">
        <h1>Emotion Wellness Tracker 🧠</h1>
        <p>Track your emotional wellbeing in real-time</p>
      </div>

      {/* =========================
          WEBCAM SECTION - Top (Smaller)
      ========================== */}

      <div className="emotion-webcam-section">
        <div className="emotion-webcam-wrapper">

          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="emotion-webcam"
            videoConstraints={{
              facingMode: "user",
              width: { ideal: 400 },
              height: { ideal: 300 }
            }}
            onUserMedia={() => {
              console.log("Webcam started");
              setWebcamReady(true);
              setTimeout(() => {
                detectEmotion();
              }, 1000);
            }}
          />

          {loading && (
            <div className="emotion-loading-overlay">
              <div className="emotion-loading-spinner"></div>
              <p>Analyzing your emotion...</p>
            </div>
          )}

        </div>

        <p className="emotion-webcam-hint">
          📸 Your camera is on. We'll detect your emotion automatically every 5 seconds.
        </p>
      </div>

      {/* =========================
          TWO COLUMN LAYOUT - Bottom
      ========================== */}

      <div className="emotion-bottom-grid">

        {/* Left Column - Detection & Results */}
        <div className="emotion-left-column">

          {/* Detect Button */}
          <button
            onClick={detectEmotion}
            disabled={loading}
            className="emotion-detect-btn"
          >
            {loading ? (
              <>
                <span className="emotion-btn-spinner"></span>
                Detecting...
              </>
            ) : (
              "Detect My Emotion"
            )}
          </button>

          {/* Result Section */}
          <div className="emotion-result-container">

            <div className="emotion-result-header">
              <span>AI DETECTION</span>
              <h2>Detected Emotion</h2>
            </div>

            {emotion ? (
              <div className="emotion-result-content">

                <div 
                  className="emotion-result-emotion"
                  style={{
                    borderColor: getEmotionData(emotion).color
                  }}
                >
                  <div 
                    className="emotion-result-icon"
                    style={{
                      backgroundColor: getEmotionData(emotion).color
                    }}
                  >
                    {getEmotionData(emotion).icon}
                  </div>

                  <div className="emotion-result-text">
                    <h3>{getEmotionData(emotion).label}</h3>
                    <p>
                      Confidence:{" "}
                      {confidence !== null
                        ? `${Number(confidence).toFixed(1)}%`
                        : "--"}
                    </p>
                  </div>
                </div>

                <div className="emotion-result-recommendation">
                  <span className="emotion-result-recommendation-icon">💗</span>
                  <div>
                    <h4>Wellness Recommendation</h4>
                    <p>{recommendation}</p>
                  </div>
                </div>

                {/* Comparison Message */}
                {comparisonMessage && (
                  <div className={`emotion-comparison-message ${
                    comparisonMessage.includes("Great") ? "match" : "mismatch"
                  }`}>
                    <p>{comparisonMessage}</p>
                  </div>
                )}

              </div>
            ) : (
              <div className="emotion-result-waiting">
                <div className="emotion-result-waiting-icon">🧘</div>
                <p>
                  {loading
                    ? "Analyzing your emotion..."
                    : "Waiting for emotion detection..."}
                </p>
                <span className="emotion-result-waiting-hint">
                  Click "Detect My Emotion" or wait for automatic detection
                </span>
              </div>
            )}

            {error && (
              <div className="emotion-result-error">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column - User Mood Input */}
        <div className="emotion-right-column">

          <div className="emotion-mood-card">

            <div className="emotion-mood-header">
              <span>HOW IS YOUR MOOD?</span>
              <h3>Tell us about your mood</h3>
            </div>

            {!moodSubmitted ? (
              <div className="emotion-mood-input">
                <div className="emotion-mood-options">
                  {Object.entries(userMoods).map(([key, value]) => (
                    <button
                      key={key}
                      className={`emotion-mood-option ${userMood === key ? "active" : ""}`}
                      onClick={() => setUserMood(key)}
                      style={{
                        borderColor: userMood === key ? "#ff6b9a" : "#e0e0e0",
                        backgroundColor: userMood === key ? "#fff0f5" : "white"
                      }}
                    >
                      <span>{value.icon}</span>
                      {value.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleMoodSubmit}
                  disabled={!userMood}
                  className="emotion-mood-submit"
                >
                  Submit Mood →
                </button>
              </div>
            ) : (
              <div className="emotion-mood-confirmed">
                <div className="emotion-mood-confirmed-icon">✅</div>
                <h4>Mood submitted!</h4>
                <p>You're feeling <strong>{userMoods[userMood]?.label || userMood}</strong> today.</p>
                <button
                  onClick={() => {
                    setMoodSubmitted(false);
                    setUserMood("");
                    setComparisonMessage("");
                  }}
                  className="emotion-mood-change"
                >
                  Change Mood
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default EmotionTracker;