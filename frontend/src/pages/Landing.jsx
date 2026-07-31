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

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
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
            <span>HerCare</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
          </ul>
          <div className="nav-buttons">
            <Link to="/login">
              <button className="nav-login">Login</button>
            </Link>
            <Link to="/signup">
              <button className="nav-signup">Sign Up</button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <span className="hero-badge">✨ Empowering Women's Health</span>
            </motion.div>
            <motion.h1 variants={fadeInUp}>
              Your Journey to <span className="gradient-text">Wellness</span> Starts Here
            </motion.h1>
            <motion.p variants={fadeInUp}>
              Personalized healthcare solutions designed for every stage of a woman's life. 
              From reproductive health to mental wellness, we've got you covered.
            </motion.p>
            <motion.div variants={fadeInUp} className="hero-buttons">
              <Link to="/signup">
                <button className="btn-primary">
                  Start Your Journey ✨
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-secondary">
                  Sign In →
                </button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            className="hero-illustration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="floating-icon icon-1">
              <FaHeartbeat />
            </div>
            <div className="floating-icon icon-2">
              <GiFemale />
            </div>
            <div className="floating-icon icon-3">
              <FaCalendarCheck />
            </div>
            <div className="floating-icon icon-4">
              <GiHealthNormal />
            </div>
            <div className="hero-circle"></div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="features" style={{ paddingTop: '5rem' }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>About <span className="gradient-text">HerCare</span></h2>
          <p>We're on a mission to transform women's healthcare worldwide</p>
        </motion.div>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555' }}>
            HerCare was founded with a simple yet powerful vision: to provide every woman with 
            accessible, personalized, and compassionate healthcare. We combine cutting-edge technology 
            with expert medical guidance to create a holistic approach to women's wellness.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="features">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Why Choose <span className="gradient-text">HerCare</span></h2>
          <p>Comprehensive care tailored to your unique needs at every life stage</p>
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
            <motion.div className="feature-icon" variants={cardHover}>
              <FaHeartbeat />
            </motion.div>
            <h3>Holistic Care</h3>
            <p>Complete wellness approach combining physical, mental, and emotional health support.</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="feature-icon" variants={cardHover}>
              <FaCalendarCheck />
            </motion.div>
            <h3>Personalized Plans</h3>
            <p>Custom health plans based on your unique biology, lifestyle, and goals.</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            variants={fadeInUp}
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="feature-icon" variants={cardHover}>
              <FaShieldAlt />
            </motion.div>
            <h3>Safe & Private</h3>
            <p>Your data is protected with bank-level security and complete confidentiality.</p>
          </motion.div>
        </motion.div>
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
                Ready to Transform Your Health?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Join thousands of women who've discovered a better way to care for themselves.
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
      <section id="contact" className="features" style={{ paddingBottom: '3rem' }}>
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
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem' }}>📧 hello@hercare.com</p>
            <p style={{ marginBottom: '1rem' }}>📞 +1 (555) 123-4567</p>
            <p>📍 123 Wellness Ave, Suite 100, San Francisco, CA 94105</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <div className="footer-logo">
                <GiFlowerStar className="footer-logo-icon" />
                <span>HerCare</span>
              </div>
              <p>Empowering women through personalized healthcare solutions.</p>
              <div className="social-links">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaLinkedinIn /></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About Us</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Health Blog</a></li>
                <li><a href="#">Wellness Guide</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <ul>
                <li>📧 hello@hercare.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Wellness Ave, Suite 100</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 HerCare. All rights reserved. | Empowering women's health worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;