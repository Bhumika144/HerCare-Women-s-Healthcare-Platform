import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";

export default function Settings() {
  const navigate = useNavigate();

  /* =========================
     USER
  ========================== */

  const user = JSON.parse(localStorage.getItem("user")) || {};

  /* =========================
     SETTINGS STATES
  ========================== */

  const [notifications, setNotifications] = useState(true);
  const [periodReminder, setPeriodReminder] = useState(true);
  const [mindfulnessReminder, setMindfulnessReminder] = useState(false);

  const [emotionDetection, setEmotionDetection] = useState(true);
  const [saveEmotionHistory, setSaveEmotionHistory] = useState(true);
  const [includeEmotionReport, setIncludeEmotionReport] = useState(true);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("hercare-dark-mode") === "true"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("hercare-language") || "English"
  );

  /* =========================
     APPLY DARK MODE ON LOAD
  ========================== */

  useEffect(() => {
    const savedDarkMode =
      localStorage.getItem("hercare-dark-mode") === "true";

    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  /* =========================
     DARK MODE
  ========================== */

  const handleDarkMode = (enabled) => {
    setDarkMode(enabled);

    if (enabled) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("hercare-dark-mode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("hercare-dark-mode", "false");
    }
  };

  /* =========================
     LANGUAGE
  ========================== */

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    setLanguage(selectedLanguage);
    localStorage.setItem("hercare-language", selectedLanguage);
  };

  /* =========================
     LOGOUT
  ========================== */

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      window.location.href = "/";
    }
  };

  /* =========================
     DELETE DATA
  ========================== */

  const handleDeleteData = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your personal data? This action cannot be undone."
    );

    if (confirmDelete) {
      alert("Your data deletion request has been submitted.");
    }
  };

  /* =========================
     TOGGLE COMPONENT
  ========================== */

  const Toggle = ({ checked, onChange }) => {
    return (
      <button
        type="button"
        className={`toggle ${checked ? "active" : ""}`}
        onClick={() => onChange(!checked)}
        aria-label="Toggle setting"
      >
        <span></span>
      </button>
    );
  };

  return (
    <div className="settings-page">

      {/* =================================
          HEADER
      ================================== */}

      <div className="settings-header">
        <div>
          <h2>Settings ⚙️</h2>

          <p>
            Manage your preferences, privacy and account details.
          </p>
        </div>
      </div>


      {/* =================================
          ACCOUNT
      ================================== */}

      <section className="settings-section">

        <h3>👤 Account</h3>

        {/* PROFILE */}

        <div className="settings-card">

          <div className="setting-icon">
            👤
          </div>

          <div className="setting-content">

            <h4>Profile</h4>

            <p>
              Manage your personal profile information.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() => navigate("/dashboard/profile")}
          >
            Edit
          </button>

        </div>


        {/* EMAIL */}

        <div className="settings-card">

          <div className="setting-icon">
            📧
          </div>

          <div className="setting-content">

            <h4>Email Address</h4>

            <p>
              {user.email || "Your registered email address"}
            </p>

          </div>

        </div>


        {/* PASSWORD */}

        <div className="settings-card">

          <div className="setting-icon">
            🔐
          </div>

          <div className="setting-content">

            <h4>Password & Security</h4>

            <p>
              Keep your HerCare account secure.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              alert(
                "Password change option will be available here."
              )
            }
          >
            Change
          </button>

        </div>

      </section>


      {/* =================================
          NOTIFICATIONS
      ================================== */}

      <section className="settings-section">

        <h3>🔔 Notifications</h3>


        {/* GENERAL NOTIFICATIONS */}

        <div className="settings-card">

          <div className="setting-icon">
            🔔
          </div>

          <div className="setting-content">

            <h4>Notifications</h4>

            <p>
              Enable or disable HerCare notifications.
            </p>

          </div>

          <Toggle
            checked={notifications}
            onChange={setNotifications}
          />

        </div>


        {/* PERIOD REMINDER */}

        <div className="settings-card">

          <div className="setting-icon">
            🩸
          </div>

          <div className="setting-content">

            <h4>Period Reminder</h4>

            <p>
              Receive reminders about your upcoming period.
            </p>

          </div>

          <Toggle
            checked={periodReminder}
            onChange={setPeriodReminder}
          />

        </div>


        {/* MINDFULNESS */}

        <div className="settings-card">

          <div className="setting-icon">
            🧘
          </div>

          <div className="setting-content">

            <h4>Mindfulness Reminder</h4>

            <p>
              Get reminders to take time for mindfulness and
              relaxation.
            </p>

          </div>

          <Toggle
            checked={mindfulnessReminder}
            onChange={setMindfulnessReminder}
          />

        </div>

      </section>


      {/* =================================
          HEALTH & WELLNESS
      ================================== */}

      <section className="settings-section">

        <h3>🌸 Health & Wellness</h3>


        {/* PERIOD TRACKER */}

        <div className="settings-card">

          <div className="setting-icon">
            🩸
          </div>

          <div className="setting-content">

            <h4>Period Tracker</h4>

            <p>
              Manage your cycle tracking and prediction
              preferences.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              navigate("/dashboard/period-tracker")
            }
          >
            Manage
          </button>

        </div>


        {/* EMOTION DETECTION */}

        <div className="settings-card">

          <div className="setting-icon">
            😊
          </div>

          <div className="setting-content">

            <h4>Emotion Detection</h4>

            <p>
              Allow HerCare to analyze facial expressions
              for emotional wellness insights.
            </p>

          </div>

          <Toggle
            checked={emotionDetection}
            onChange={setEmotionDetection}
          />

        </div>


        {/* SAVE EMOTION HISTORY */}

        <div className="settings-card">

          <div className="setting-icon">
            💾
          </div>

          <div className="setting-content">

            <h4>Save Emotion History</h4>

            <p>
              Store detected emotions to help identify
              emotional patterns.
            </p>

          </div>

          <Toggle
            checked={saveEmotionHistory}
            onChange={setSaveEmotionHistory}
          />

        </div>


        {/* EMOTION REPORT */}

        <div className="settings-card">

          <div className="setting-icon">
            📊
          </div>

          <div className="setting-content">

            <h4>Emotion Data in Health Report</h4>

            <p>
              Include your emotion patterns in personalized
              health reports.
            </p>

          </div>

          <Toggle
            checked={includeEmotionReport}
            onChange={setIncludeEmotionReport}
          />

        </div>


        {/* WELLNESS PREFERENCES */}

        <div className="settings-card">

          <div className="setting-icon">
            🧘‍♀️
          </div>

          <div className="setting-content">

            <h4>Wellness Preferences</h4>

            <p>
              Personalize recommendations for mindfulness,
              yoga, nutrition and women's health.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              alert(
                "Wellness preferences will be available here."
              )
            }
          >
            Manage
          </button>

        </div>

      </section>


      {/* =================================
          HEALTH REPORTS
      ================================== */}

      <section className="settings-section">

        <h3>📊 Health Reports</h3>

        <div className="settings-card">

          <div className="setting-icon">
            📄
          </div>

          <div className="setting-content">

            <h4>Personalized Health Report</h4>

            <p>
              View your menstrual, symptom and emotional
              wellness insights.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              alert(
                "Health report section will open here."
              )
            }
          >
            View
          </button>

        </div>

      </section>


      {/* =================================
          PRIVACY & DATA
      ================================== */}

      <section className="settings-section">

        <h3>🔒 Privacy & Data</h3>


        {/* PRIVACY */}

        <div className="settings-card">

          <div className="setting-icon">
            🔒
          </div>

          <div className="setting-content">

            <h4>Privacy Settings</h4>

            <p>
              Manage how your personal information is used.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              alert(
                "Privacy settings will be available here."
              )
            }
          >
            Manage
          </button>

        </div>


        {/* DOWNLOAD DATA */}

        <div className="settings-card">

          <div className="setting-icon">
            📥
          </div>

          <div className="setting-content">

            <h4>Download My Data</h4>

            <p>
              Download a copy of your HerCare information.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              alert(
                "Your data download will be prepared here."
              )
            }
          >
            Download
          </button>

        </div>


        {/* DELETE DATA */}

        <div className="settings-card danger-card">

          <div className="setting-icon">
            🗑️
          </div>

          <div className="setting-content">

            <h4>Delete Personal Data</h4>

            <p>
              Permanently delete your stored health and
              wellness data.
            </p>

          </div>

          <button
            className="danger-action"
            onClick={handleDeleteData}
          >
            Delete
          </button>

        </div>

      </section>


      {/* =================================
          APPEARANCE
      ================================== */}

      <section className="settings-section">

        <h3>🎨 Appearance</h3>


        {/* DARK MODE */}

        <div className="settings-card">

          <div className="setting-icon">
            🌙
          </div>

          <div className="setting-content">

            <h4>Dark Mode</h4>

            <p>
              Use a darker appearance for a more comfortable
              experience.
            </p>

          </div>

          <Toggle
            checked={darkMode}
            onChange={handleDarkMode}
          />

        </div>


        {/* LANGUAGE */}

        <div className="settings-card">

          <div className="setting-icon">
            🌐
          </div>

          <div className="setting-content">

            <h4>Language</h4>

            <p>
              Choose your preferred language.
            </p>

          </div>

          <select
            value={language}
            onChange={handleLanguageChange}
            className="language-select"
          >

            <option value="English">
              English
            </option>

            <option value="Hindi">
              Hindi
            </option>

            <option value="Marathi">
              Marathi
            </option>

          </select>

        </div>

      </section>


      {/* =================================
          SUPPORT
      ================================== */}

      <section className="settings-section">

        <h3>❓ Support</h3>


        {/* HELP */}

        <div className="settings-card">

          <div className="setting-icon">
            ❓
          </div>

          <div className="setting-content">

            <h4>Help & Support</h4>

            <p>
              Get help with using HerCare and its features.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              alert(
                "Help & Support will be available here."
              )
            }
          >
            Open
          </button>

        </div>


        {/* ABOUT */}

        <div className="settings-card">

          <div className="setting-icon">
            ℹ️
          </div>

          <div className="setting-content">

            <h4>About HerCare</h4>

            <p>
              Learn more about HerCare and its features.
            </p>

          </div>

          <button
            className="settings-action"
            onClick={() =>
              alert(
                "HerCare - Women's Health & Mental Wellness Platform"
              )
            }
          >
            View
          </button>

        </div>

      </section>


      {/* =================================
          LOGOUT
      ================================== */}

      <div className="logout-container">

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}