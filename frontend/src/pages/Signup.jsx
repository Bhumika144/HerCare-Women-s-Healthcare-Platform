import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import '../styles/Signup.css'; // import CSS

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/signup", form);
    navigate("/verify-otp", { state: { email: form.email } });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input 
          placeholder="Name" 
          value={form.name}
          onChange={e => setForm({...form, name:e.target.value})}
        />
        <input 
          placeholder="Email" 
          value={form.email}
          onChange={e => setForm({...form, email:e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={e => setForm({...form, password:e.target.value})}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
