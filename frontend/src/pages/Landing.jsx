// src/pages/Landing.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHeartbeat, 
  FaCalendarCheck, 
  FaShieldAlt, 
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from 'react-icons/fa';
import { GiFlowerStar, GiFemale, GiHealthNormal } from 'react-icons/gi';
import '../styles/Landing.css';
import yogaImage from "../assets/images/yoga.png";
import landingImage from "../assets/images/Landing.png";

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardHover = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <motion.nav 
        className="navbar"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="nav-container">
          <div className="logo" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
            <GiFlowerStar className="logo-icon" />
            <span>Her<span style={{ color: '#D47E8E' }}>CARE</span></span>
          </div>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Features</a></li>
            <li><a href="#wellness" onClick={(e) => { e.preventDefault(); scrollToSection('wellness'); }}>Wellness</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
          </ul>
          <div className="nav-buttons">
            <Link to="/login">
              <button className="nav-login">Sign In</button>
            </Link>
            <Link to="/signup">
              <button className="nav-signup">Get Started</button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Left aligned content */}
      <section id="home" className="hero">
        <div className="hero-background">
          <img src={landingImage} alt="Young woman sitting comfortably at home using smartphone" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeInLeft}>
              Your cycle.<br />
              <span className="highlight-text">Your health.</span><br />
              <span className="accent-text">Your care.</span>
            </motion.h1>
            <motion.p variants={fadeInLeft} className="hero-description">
              Your personal space to understand your cycle, care for your body, and build healthier everyday habits.
            </motion.p>
            <motion.div variants={fadeInLeft} className="hero-buttons">
              <Link to="/signup">
                <button className="btn-primary">Get Started</button>
              </Link>
              <Link to="/login">
                <button className="btn-outline">Explore HerCARE</button>
              </Link>
            </motion.div>
            <motion.p variants={fadeInLeft} className="hero-trust">
              Private • Personalized • Built for Women
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="feature-strip">
        <div className="container">
          <div className="feature-item">
            <div className="feature-icon">🔄</div>
            <span>Cycle Tracking</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🏋️‍♀️</div>
            <span>Exercise</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💧</div>
            <span>Hydration</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">😴</div>
            <span>Sleep</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🧘</div>
            <span>Mood</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🌸</div>
            <span>Self-Care</span>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section id="services" className="features">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Everything you need for your <span className="gradient-text">wellbeing</span></h2>
          <p>HerCARE brings cycle tracking, wellness and self-care together in one place, tailored specifically for you.</p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="feature-icon" variants={cardHover}>📅</motion.div>
            <h3>Cycle Tracking</h3>
            <p>Understand your patterns and predict your cycle with precision.</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="feature-icon" variants={cardHover}>✨</motion.div>
            <h3>Personalized Insights</h3>
            <p>Actionable recommendations based on your unique health data.</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="feature-icon" variants={cardHover}>☀️</motion.div>
            <h3>Daily Wellness</h3>
            <p>Track hydration, sleep, and exercise to support your energy.</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="feature-icon" variants={cardHover}>🌿</motion.div>
            <h3>Self-Care</h3>
            <p>Build mindful habits that nurture your mental and emotional health.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Yoga Image Break Section */}
      <section id="wellness" className="image-break-section">
        <img 
          src={yogaImage} 
          alt="Young woman stretching and exercising in a bright studio" 
          className="break-image"
        />
        <div className="break-overlay"></div>
        <div className="image-break-content">
          <h2>Move with purpose</h2>
          <p>Tailored exercise routines that align with your cycle and energy levels, helping you feel strong every day.</p>
        </div>
      </section>

      {/* Glassmorphism CTA Section */}
      <section className="glass-section">
        <div className="glass-container">
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-content">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Understand your body. Empower your life.
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Start building a healthier relationship with your wellbeing.
              </motion.p>
              <Link to="/signup">
                <motion.button 
                  className="glass-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Get Started Today →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Get in <span className="gradient-text">Touch</span></h2>
          <p>We'd love to hear from you. Reach out with any questions or concerns.</p>
        </motion.div>
        <div className="contact-info">
          <p>📧 hello@hercare.com</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>📍 123 Wellness Ave, Suite 100, San Francisco, CA 94105</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <div className="footer-logo">
                <GiFlowerStar className="footer-logo-icon" />
                <span>Her<span style={{ color: '#D47E8E' }}>CARE</span></span>
              </div>
              <p>Empowering women to take control of their health, cycle, and daily wellness through personalized care.</p>
              <div className="social-links">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaLinkedinIn /></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Platform</h4>
              <ul>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Features</a></li>
                <li><a href="#wellness" onClick={(e) => { e.preventDefault(); scrollToSection('wellness'); }}>Wellness Hub</a></li>
                <li><a href="#">Cycle Insights</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press Kit</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">HIPAA</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 HerCARE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;