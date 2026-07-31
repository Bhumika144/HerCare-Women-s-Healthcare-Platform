import { useEffect, useState } from "react";
import "../styles/profile.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/profile/${user.email}`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const toggleArray = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter(v => v !== value)
        : [...(prev[field] || []), value]
    }));
  };

  const save = async () => {
    await fetch("http://localhost:5000/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, ...profile })
    });

    setEdit(false);
  };

  if (!profile) return <p className="loading">Loading...</p>;

  const Chip = ({ label, field }) => (
    <span
      className={`chip ${profile[field]?.includes(label) ? "active" : ""}`}
      onClick={() => edit && toggleArray(field, label)}
    >
      {label}
    </span>
  );

  return (
    <div className="profile-wrapper">

      {/* HEADER */}
      <div className="profile-header">
        <div className="image-box">
          <img
            src={
              image ||
              "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
            }
            alt="profile"
          />
          {edit && <input type="file" onChange={handleImageUpload} />}
        </div>

        <h2>{user.name}'s Health Profile</h2>
        <p>{user.email}</p>
      </div>

      {/* PERSONAL INFO */}
      <div className="card">
        <h3>Personal Info</h3>

        <input
          disabled={!edit}
          value={profile.age || ""}
          placeholder="Age"
          onChange={(e) =>
            setProfile({ ...profile, age: e.target.value })
          }
        />

        <input
          disabled={!edit}
          value={profile.location || ""}
          placeholder="Location"
          onChange={(e) =>
            setProfile({ ...profile, location: e.target.value })
          }
        />

        <select
          disabled={!edit}
          value={profile.language || "English"}
          onChange={(e) =>
            setProfile({ ...profile, language: e.target.value })
          }
        >
          <option>English</option>
          <option>Hindi</option>
        </select>

        <select
          disabled={!edit}
          value={profile.gender || "female"}
          onChange={(e) =>
            setProfile({ ...profile, gender: e.target.value })
          }
        >
          <option value="female">Female</option>
        </select>
      </div>

      {/* MENSTRUAL HEALTH */}
      <div className="card">
        <h3>Menstrual Health</h3>

        <input
          type="date"
          disabled={!edit}
          value={profile.last_period || ""}
          onChange={(e) =>
            setProfile({ ...profile, last_period: e.target.value })
          }
        />

        <input
          disabled={!edit}
          value={profile.average_cycle_length || ""}
          placeholder="Cycle Length (e.g. 28 days)"
          onChange={(e) =>
            setProfile({
              ...profile,
              average_cycle_length: e.target.value
            })
          }
        />

        <input
          disabled={!edit}
          value={profile.period_duration || ""}
          placeholder="Period Duration (e.g. 5 days)"
          onChange={(e) =>
            setProfile({
              ...profile,
              period_duration: e.target.value
            })
          }
        />

        <select
          disabled={!edit}
          value={profile.period_regular || "regular"}
          onChange={(e) =>
            setProfile({
              ...profile,
              period_regular: e.target.value
            })
          }
        >
          <option value="regular">Regular</option>
          <option value="irregular">Irregular</option>
        </select>

        {/* Symptoms */}
        <div className="chip-group">
          {[
            "cramps",
            "mood swings",
            "bloating",
            "fatigue",
            "headache",
            "back pain"
          ].map(s => (
            <Chip key={s} label={s} field="symptoms" />
          ))}
        </div>

        {/* Pregnancy */}
        <select
          disabled={!edit}
          value={profile.pregnancyStatus || "no"}
          onChange={(e) =>
            setProfile({
              ...profile,
              pregnancyStatus: e.target.value
            })
          }
        >
          <option value="no">Not Pregnant</option>
          <option value="trying">Trying to Conceive</option>
          <option value="pregnant">Pregnant</option>
        </select>
      </div>

      {/* FITNESS */}
      <div className="card">
        <h3>Fitness & Lifestyle</h3>

        <select
          disabled={!edit}
          value={profile.fitnessLevel || "beginner"}
          onChange={(e) =>
            setProfile({
              ...profile,
              fitnessLevel: e.target.value
            })
          }
        >
          <option>beginner</option>
          <option>intermediate</option>
          <option>advanced</option>
        </select>

        <div className="chip-group">
          {[
            "yoga",
            "pilates",
            "gym",
            "walking",
            "home workout"
          ].map(a => (
            <Chip key={a} label={a} field="activities" />
          ))}
        </div>
      </div>

      {/* BUTTON */}
      {edit ? (
        <button className="save-btn" onClick={save}>
          Save Changes
        </button>
      ) : (
        <button className="edit-btn" onClick={() => setEdit(true)}>
          Edit Profile
        </button>
      )}
    </div>
  );
}