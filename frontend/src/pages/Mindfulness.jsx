import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Mindfulness.css";

export default function Mindfulness() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [clickEffect, setClickEffect] = useState(null);
  const [showDescription, setShowDescription] = useState(null);

  const descriptions = {
    period: "Gentle exercises to ease menstrual discomfort and cramps",
    yoga: "Balance your body and mind with calming yoga poses",
    meditation: "Find inner peace and reduce stress through guided meditation",
    exercise: "Boost your energy and mood with general workouts"
  };

  const buttonConfigs = {
    period: {
      label: "Period Relief Exercises",
      path: "/dashboard/mindfulness/period-exercise",
      bgColor: "#ff6b9a",
      description: "Gentle exercises to ease menstrual discomfort and cramps",
      benefit: "Relieves cramps & reduces discomfort"
    },
    yoga: {
      label: "Yoga",
      path: "/dashboard/mindfulness/yoga",
      bgColor: "#9b59b6",
      description: "Balance your body and mind with calming yoga poses",
      benefit: "Improves flexibility & reduces stress"
    },
    meditation: {
      label: "Meditation",
      path: "/dashboard/mindfulness/meditation",
      bgColor: "#3498db",
      description: "Find inner peace and reduce stress through guided meditation",
      benefit: "Enhances focus & emotional wellbeing"
    },
    exercise: {
      label: "General Exercise",
      path: "/dashboard/mindfulness/exercise",
      bgColor: "#2ecc71",
      description: "Boost your energy and mood with general workouts",
      benefit: "Boosts energy & improves mood"
    }
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

  return (
    <div className="mindfulness-page">

      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="mindfulness-hero">

        <div className="mindfulness-hero-content">

          <span className="mindfulness-small-title">
            HERCARE WELLNESS
          </span>

          <h1>
            Mindfulness & 
            <br />
            <span>Wellness Journey</span>
          </h1>

          <p>
            Choose an activity to begin your wellness journey
            and find balance in your daily life.
          </p>

        </div>

        <div className="mindfulness-hero-image">

          <img
            src="/src/assets/images/Mindfulness.png"
            alt="Woman meditating in a peaceful setting"
          />

        </div>

      </section>

      {/* =========================
          ACTIVITY CARDS
      ========================== */}

      <section className="mindfulness-activities">

        <div className="mindfulness-activities-header">

          <span>CHOOSE YOUR ACTIVITY</span>

          <h2>
            Begin Your Wellness Journey
          </h2>

          <p>
            Select a practice that resonates with you today
          </p>

        </div>

        <div className="mindfulness-cards-grid">

          {Object.entries(buttonConfigs).map(([key, config]) => (
            <div
              key={key}
              className={`mindfulness-card 
                ${hoveredButton === key ? 'hovered' : ''} 
                ${clickEffect === key ? 'clicked' : ''}`}
              onClick={() => handleButtonClick(config.path, key)}
              onMouseEnter={() => {
                setHoveredButton(key);
                setShowDescription(key);
              }}
              onMouseLeave={() => {
                setHoveredButton(null);
                setShowDescription(null);
              }}
              style={{
                borderColor: config.bgColor,
                cursor: 'pointer'
              }}
            >
              {/* Card Content */}
              <div className="mindfulness-card-content">
                <h3>{config.label}</h3>
                <p>{config.description}</p>
                
                {/* Benefit Tag */}
                <div className="mindfulness-card-benefit">
                  <span>{config.benefit}</span>
                </div>
              </div>

              {/* Card Footer - Start Button */}
              <div className="mindfulness-card-footer">
                <button 
                  className="mindfulness-start-btn"
                  style={{
                    backgroundColor: config.bgColor
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick(config.path, key);
                  }}
                >
                  Start Exercise 
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* Description Display on Hover */}
        {showDescription && (
          <div className="mindfulness-description">
            <p>{descriptions[showDescription]}</p>
          </div>
        )}

      </section>

      {/* =========================
          MOTIVATIONAL QUOTE
      ========================== */}

      <section className="mindfulness-quote">

        <div className="mindfulness-quote-content">

          <span className="mindfulness-quote-icon">"</span>

          <p>
            Mindfulness is the aware, balanced acceptance 
            of the present experience.
          </p>

          <span className="mindfulness-quote-author">
            — Mindfulness Practice
          </span>

        </div>

      </section>

    </div>
  );
}