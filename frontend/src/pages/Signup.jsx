// src/pages/Signup.jsx
import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { GiFlowerStar } from 'react-icons/gi';
import { FaEnvelope, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';
import '../styles/Signup.css';

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await api.post("/signup", form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Background with gradient */}
      <div className="signup-background">
        <div className="signup-overlay"></div>
      </div>

      {/* Signup Card */}
      <motion.div 
        className="signup-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="signup-card">
          {/* Back Button */}
          <Link to="/" className="back-button">
            <FaArrowLeft /> Back to Home
          </Link>

          {/* Logo */}
          <div className="signup-logo">
            <GiFlowerStar className="logo-icon" />
            <span>Her<span style={{ color: '#D47E8E' }}>CARE</span></span>
          </div>

          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Start your journey to better health today</p>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-icon">
                <FaUser className="icon" />
              </div>
              <input 
                type="text"
                className="form-input"
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FaEnvelope className="icon" />
              </div>
              <input 
                type="email"
                className="form-input"
                placeholder="Email Address"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FaLock className="icon" />
              </div>
              <input 
                type="password"
                className="form-input"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="signup-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span> Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="signup-footer">
            Already have an account? <Link to="/login" className="login-link">Sign In</Link>
          </p>

          <div className="signup-divider">
            <span>or continue with</span>
          </div>

          <div className="social-signup">
            <button className="social-btn google">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="social-btn facebook">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              Facebook
            </button>
          </div>

          <p className="signup-terms">
            By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}