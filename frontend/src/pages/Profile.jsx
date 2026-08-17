import { useEffect, useState } from "react";
import api from "../api";
import "../styles/profile.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ============================
  // FETCH PROFILE
  // ============================

  useEffect(() => {
    if (user?.email) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${user.email}`);

      setProfile(res.data);

    } catch (error) {
      console.error("❌ Profile fetch error:", error);
    }
  };


  // ============================
  // IMAGE
  // ============================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));

      // For now we only preview it.
      // Later we can upload the actual image to backend.
    }
  };


  // ============================
  // NORMAL FIELD UPDATE
  // ============================

  const updateField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  // ============================
  // ARRAY FIELD UPDATE
  // ============================

  const toggleArray = (field, value) => {
    setProfile((prev) => {

      const current = prev[field] || [];

      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };

    });
  };


  // ============================
  // SAVE PROFILE
  // ============================

  const save = async () => {

    try {

      setSaving(true);
      setMessage("");

      const res = await api.put(
        "/profile/update",
        {
          email: user.email,

          // Personal
          display_name: profile.display_name,
          age: profile.age,
          location: profile.location,
          language: profile.language,
          gender: profile.gender,

          // Menstrual
          last_period: profile.last_period,
          average_cycle_length:
            profile.average_cycle_length,
          period_duration:
            profile.period_duration,
          period_regular:
            profile.period_regular,

          symptoms:
            profile.symptoms || [],

          pregnancy_status:
            profile.pregnancy_status,

          medical_issues:
            profile.medical_issues || [],

          // Lifestyle
          fitness_level:
            profile.fitness_level,

          activities:
            profile.activities || [],

          // Goals
          goals:
            profile.goals || [],
        }
      );

      console.log("✅ PROFILE UPDATED:", res.data);

      setMessage("Profile updated successfully 🌸");

      setEdit(false);

      // Refresh profile from DB
      await fetchProfile();

    } catch (error) {

      console.error(
        "❌ Profile update error:",
        error
      );

      setMessage(
        "Unable to update profile. Please try again."
      );

    } finally {

      setSaving(false);

    }
  };


  if (!profile) {
    return (
      <div className="profile-loading">
        Loading your profile... 🌸
      </div>
    );
  }


  // ============================
  // CHIP COMPONENT
  // ============================

  const Chip = ({ label, field }) => {

    const selected =
      profile[field]?.includes(label);

    return (
      <button
        type="button"
        className={`chip ${
          selected ? "active" : ""
        }`}
        onClick={() =>
          edit &&
          toggleArray(field, label)
        }
      >
        {label}
      </button>
    );

  };


  return (

    <div className="profile-wrapper">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="profile-header">

        <div className="image-box">

          <img
            src={
              image ||
              "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
            }
            alt="profile"
          />

          {edit && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          )}

        </div>


        <div>

          <h2>
            {profile.display_name ||
              user?.name ||
              "User"}
            's Health Profile
          </h2>

          <p>
            {user.email}
          </p>

        </div>

      </div>


      {/* ==================================
          MESSAGE
      ================================== */}

      {message && (
        <div className="profile-message">
          {message}
        </div>
      )}


      {/* ==================================
          PERSONAL INFORMATION
      ================================== */}

      <div className="card">

        <h3>
          👤 Personal Information
        </h3>


        <label>
          Display Name
        </label>

        <input
          disabled={!edit}
          value={
            profile.display_name || ""
          }
          placeholder="Your name"
          onChange={(e) =>
            updateField(
              "display_name",
              e.target.value
            )
          }
        />


        <label>
          Age
        </label>

        <input
          type="number"
          disabled={!edit}
          value={profile.age || ""}
          placeholder="Age"
          onChange={(e) =>
            updateField(
              "age",
              e.target.value
            )
          }
        />


        <label>
          Location
        </label>

        <input
          disabled={!edit}
          value={
            profile.location || ""
          }
          placeholder="City / Location"
          onChange={(e) =>
            updateField(
              "location",
              e.target.value
            )
          }
        />


        <label>
          Preferred Language
        </label>

        <select
          disabled={!edit}
          value={
            profile.language ||
            "English"
          }
          onChange={(e) =>
            updateField(
              "language",
              e.target.value
            )
          }
        >
          <option>
            English
          </option>

          <option>
            Hindi
          </option>

          <option>
            Marathi
          </option>

        </select>


        <label>
          Gender
        </label>

        <select
          disabled={!edit}
          value={
            profile.gender ||
            "female"
          }
          onChange={(e) =>
            updateField(
              "gender",
              e.target.value
            )
          }
        >
          <option value="female">
            Female
          </option>

        </select>

      </div>


      {/* ==================================
          MENSTRUAL HEALTH
      ================================== */}

      <div className="card">

        <h3>
          🌸 Menstrual Health
        </h3>


        <label>
          Last Period Date
        </label>

        <input
          type="date"
          disabled={!edit}
          value={
            profile.last_period || ""
          }
          onChange={(e) =>
            updateField(
              "last_period",
              e.target.value
            )
          }
        />


        <label>
          Average Cycle Length
        </label>

        <input
          type="number"
          disabled={!edit}
          value={
            profile.average_cycle_length ||
            ""
          }
          placeholder="Example: 28"
          onChange={(e) =>
            updateField(
              "average_cycle_length",
              e.target.value
            )
          }
        />


        <label>
          Period Duration
        </label>

        <input
          type="number"
          disabled={!edit}
          value={
            profile.period_duration ||
            ""
          }
          placeholder="Example: 5 days"
          onChange={(e) =>
            updateField(
              "period_duration",
              e.target.value
            )
          }
        />


        <label>
          Cycle Regularity
        </label>

        <select
          disabled={!edit}
          value={
            profile.period_regular ||
            "regular"
          }
          onChange={(e) =>
            updateField(
              "period_regular",
              e.target.value
            )
          }
        >
          <option value="regular">
            Regular
          </option>

          <option value="irregular">
            Irregular
          </option>

        </select>


        {/* SYMPTOMS */}

        <label>
          Common Symptoms
        </label>

        <div className="chip-group">

          {[
            "cramps",
            "mood swings",
            "bloating",
            "fatigue",
            "headache",
            "back pain",
          ].map((symptom) => (

            <Chip
              key={symptom}
              label={symptom}
              field="symptoms"
            />

          ))}

        </div>


        {/* MEDICAL ISSUES */}

        <label>
          Medical Conditions / Issues
        </label>

        <div className="chip-group">

          {[
            "PCOS",
            "PCOD",
            "Endometriosis",
            "Thyroid",
            "Anemia",
            "None",
          ].map((issue) => (

            <Chip
              key={issue}
              label={issue}
              field="medical_issues"
            />

          ))}

        </div>


        {/* PREGNANCY */}

        <label>
          Pregnancy Status
        </label>

        <select
          disabled={!edit}
          value={
            profile.pregnancy_status ||
            "no"
          }
          onChange={(e) =>
            updateField(
              "pregnancy_status",
              e.target.value
            )
          }
        >

          <option value="no">
            Not Pregnant
          </option>

          <option value="trying">
            Trying to Conceive
          </option>

          <option value="pregnant">
            Pregnant
          </option>

        </select>

      </div>


      {/* ==================================
          FITNESS & LIFESTYLE
      ================================== */}

      <div className="card">

        <h3>
          🧘‍♀️ Fitness & Lifestyle
        </h3>


        <label>
          Fitness Level
        </label>

        <select
          disabled={!edit}
          value={
            profile.fitness_level ||
            "beginner"
          }
          onChange={(e) =>
            updateField(
              "fitness_level",
              e.target.value
            )
          }
        >

          <option value="beginner">
            Beginner
          </option>

          <option value="intermediate">
            Intermediate
          </option>

          <option value="advanced">
            Advanced
          </option>

        </select>


        <label>
          Activities
        </label>

        <div className="chip-group">

          {[
            "yoga",
            "pilates",
            "gym",
            "walking",
            "home workout",
          ].map((activity) => (

            <Chip
              key={activity}
              label={activity}
              field="activities"
            />

          ))}

        </div>

      </div>


      {/* ==================================
          GOALS
      ================================== */}

      <div className="card">

        <h3>
          🎯 Goals & Personalization
        </h3>

        <div className="chip-group">

          {[
            "Track Period",
            "Improve Fitness",
            "Manage Stress",
            "Improve Sleep",
            "Healthy Diet",
            "Understand My Cycle",
          ].map((goal) => (

            <Chip
              key={goal}
              label={goal}
              field="goals"
            />

          ))}

        </div>

      </div>


      {/* ==================================
          BUTTON
      ================================== */}

      <div className="profile-actions">

        {edit ? (

          <button
            className="save-btn"
            onClick={save}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes 🌸"}
          </button>

        ) : (

          <button
            className="edit-btn"
            onClick={() =>
              setEdit(true)
            }
          >
            ✏️ Edit Profile
          </button>

        )}

      </div>

    </div>
  );
}