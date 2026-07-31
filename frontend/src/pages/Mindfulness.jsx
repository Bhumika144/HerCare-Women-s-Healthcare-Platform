import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Mindfulness() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [clickEffect, setClickEffect] = useState(null);

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "18px",
    margin: "15px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ff6b9a",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    position: "relative",
    overflow: "hidden"
  };

  // Add interactive styles based on state
  const getButtonStyle = (buttonName) => {
    let style = { ...buttonStyle };
    
    if (hoveredButton === buttonName) {
      style = {
        ...style,
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        backgroundColor: "#ff477e",
        transition: "all 0.3s ease"
      };
    }
    
    if (clickEffect === buttonName) {
      style = {
        ...style,
        transform: "scale(0.95)",
        transition: "transform 0.1s ease"
      };
    }
    
    return style;
  };

  const handleButtonClick = (path, buttonName) => {
    setClickEffect(buttonName);
    setTimeout(() => {
      navigate(path);
    }, 150);
    setTimeout(() => {
      setClickEffect(null);
    }, 200);
  };

  const descriptions = {
    period: "Gentle exercises to ease menstrual discomfort and cramps",
    yoga: "Balance your body and mind with calming yoga poses",
    meditation: "Find inner peace and reduce stress through guided meditation",
    exercise: "Boost your energy and mood with general workouts"
  };

  const [showDescription, setShowDescription] = useState(null);

  // Button configurations with emoji/images
  const buttonConfigs = {
    period: {
      emoji: "🌸",
      label: "Period Relief Exercises",
      path: "/dashboard/mindfulness/period-exercise"
    },
    yoga: {
      emoji: "🧘‍♀️",
      label: "Yoga",
      path: "/dashboard/mindfulness/yoga"
    },
    meditation: {
      emoji: "🕉️",
      label: "Meditation",
      path: "/dashboard/mindfulness/meditation"
    },
    exercise: {
      emoji: "💪",
      label: "General Exercise",
      path: "/dashboard/mindfulness/exercise"
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Mindfulness 🧘</h1>
      <br></br>
      {/* Add a subtitle */}
      <p style={{ 
        color: "#666", 
        fontSize: "18px", 
        marginTop: "-10px",
        marginBottom: "30px"
      }}>
        Choose an activity to begin your wellness journey
      </p>

      <div style={{ marginTop: "40px" }}>

        <button
          style={getButtonStyle("period")}
          onClick={() => handleButtonClick(buttonConfigs.period.path, "period")}
          onMouseEnter={() => {
            setHoveredButton("period");
            setShowDescription("period");
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            setShowDescription(null);
          }}
        >
          <span style={{ fontSize: "24px" }}>{buttonConfigs.period.emoji}</span>
          {buttonConfigs.period.label}
        </button>

        <button
          style={getButtonStyle("yoga")}
          onClick={() => handleButtonClick(buttonConfigs.yoga.path, "yoga")}
          onMouseEnter={() => {
            setHoveredButton("yoga");
            setShowDescription("yoga");
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            setShowDescription(null);
          }}
        >
          <span style={{ fontSize: "24px" }}>{buttonConfigs.yoga.emoji}</span>
          {buttonConfigs.yoga.label}
        </button>

        <button
          style={getButtonStyle("meditation")}
          onClick={() => handleButtonClick(buttonConfigs.meditation.path, "meditation")}
          onMouseEnter={() => {
            setHoveredButton("meditation");
            setShowDescription("meditation");
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            setShowDescription(null);
          }}
        >
          <span style={{ fontSize: "24px" }}>{buttonConfigs.meditation.emoji}</span>
          {buttonConfigs.meditation.label}
        </button>

        <button
          style={getButtonStyle("exercise")}
          onClick={() => handleButtonClick(buttonConfigs.exercise.path, "exercise")}
          onMouseEnter={() => {
            setHoveredButton("exercise");
            setShowDescription("exercise");
          }}
          onMouseLeave={() => {
            setHoveredButton(null);
            setShowDescription(null);
          }}
        >
          <span style={{ fontSize: "24px" }}>{buttonConfigs.exercise.emoji}</span>
          {buttonConfigs.exercise.label}
        </button>

      </div>

      {/* Description display area */}
      {showDescription && (
        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
          animation: "fadeIn 0.3s ease"
        }}>
          <p style={{ margin: 0, color: "#333", fontSize: "16px" }}>
            {descriptions[showDescription]}
          </p>
        </div>
      )}

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Optional: Add a subtle shine effect on hover */
          button:hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shine 0.5s ease;
          }
          
          @keyframes shine {
            to {
              left: 100%;
            }
          }
        `}
      </style>

      {/* Optional: Add a motivational quote */}
      <div style={{
        marginTop: "50px",
        padding: "20px",
        borderTop: "2px solid #ff6b9a",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <p style={{ 
          fontStyle: "italic", 
          color: "#666",
          fontSize: "14px"
        }}>
          "Mindfulness is the aware, balanced acceptance of the present experience."
        </p>
      </div>
    </div>
  );
}