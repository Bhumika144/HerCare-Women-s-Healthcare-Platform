import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaLeaf,
  FaBrain,
  FaUsers,
  FaBook,
  FaRobot,
  FaCog,
  FaSignOutAlt,
  FaHeart,
  FaChartLine,
  FaQuoteLeft,
  FaBell,
  FaUserCircle,
  FaFileDownload,
} from "react-icons/fa";
import { GiFlowerStar } from "react-icons/gi";
import { getDashboardData } from "../api"; // ✅ Fixed import path
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Cycle Data - populated from API
  const [cycleData, setCycleData] = useState({
    currentDay: 0,
    cycleLength: 0,
    phase: "No Data",
    nextPeriod: "Not available",
    ovulationDay: 0,
    daysUntilPeriod: null,
    lastPeriodDate: null,
    predictedPeriodDate: null,
    periodDates: [],
    healthScore: 0,
    moodTrend: "No data",
    nextPeriodDate: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch real dashboard data
    fetchDashboardData(parsedUser.email);

    // Greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    // Time update
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [navigate]);

  const fetchDashboardData = async (email) => {
    try {
      setLoading(true);
      const data = await getDashboardData(email);
      setDashboardData(data);
      
      // Update cycle data with real values from backend
      if (data && data.period_data) {
        const periodData = data.period_data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate days until next period
        let daysUntil = null;
        if (periodData.predicted_period_date) {
          const predictedDate = new Date(periodData.predicted_period_date);
          predictedDate.setHours(0, 0, 0, 0);
          const diffTime = predictedDate.getTime() - today.getTime();
          daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Determine phase based on current day
        let phase = "Not Tracked";
        const day = periodData.current_day || 0;
        const cycleLength = periodData.cycle_length || 28;
        
        if (day > 0) {
          if (day <= 7) {
            phase = "Menstrual Phase";
          } else if (day <= 14) {
            phase = "Follicular Phase";
          } else if (day <= 16) {
            phase = "Ovulation Phase";
          } else if (day <= cycleLength - 5) {
            phase = "Luteal Phase";
          } else {
            phase = "Premenstrual Phase";
          }
        }

        setCycleData({
          currentDay: day,
          cycleLength: cycleLength,
          phase: phase,
          nextPeriod: daysUntil !== null && daysUntil >= 0 
            ? `${daysUntil} days` 
            : daysUntil !== null && daysUntil < 0 
              ? `${Math.abs(daysUntil)} days late` 
              : "Not available",
          daysUntilPeriod: daysUntil,
          lastPeriodDate: periodData.last_period_date || null,
          predictedPeriodDate: periodData.predicted_period_date || null,
          periodDates: periodData.period_dates || [],
          healthScore: data.health_score || 0,
          moodTrend: data.mood_trend || "No data",
          nextPeriodDate: periodData.predicted_period_date || null,
        });
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Could not load period data. Please complete your period setup.");
      // Set default values when data is not available
      setCycleData({
        currentDay: 0,
        cycleLength: 0,
        phase: "Not Tracked",
        nextPeriod: "Not available",
        daysUntilPeriod: null,
        lastPeriodDate: null,
        predictedPeriodDate: null,
        periodDates: [],
        healthScore: 0,
        moodTrend: "No data",
        nextPeriodDate: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Download Report
  const downloadReport = () => {
    const reportContent = `
HERCARE WELLNESS REPORT

Name: ${user?.name || "User"}

Cycle Day: ${cycleData.currentDay}
Current Phase: ${cycleData.phase}
Next Period: ${cycleData.nextPeriod}
Cycle Length: ${cycleData.cycleLength} days
Last Period: ${cycleData.lastPeriodDate || "Not recorded"}

Mood Trend: ${cycleData.moodTrend}
Health Score: ${cycleData.healthScore}%

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "HerCare_Report.txt";
    link.click();
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Animations
  const sidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const mainContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: FaTachometerAlt,
      label: "Dashboard",
      end: true,
    },
    {
      path: "/dashboard/period-tracker",
      icon: FaCalendarAlt,
      label: "Period Tracker",
    },
    {
      path: "/dashboard/mindfulness",
      icon: FaLeaf,
      label: "Mindfulness",
    },
    {
      path: "/dashboard/community",
      icon: FaUsers,
      label: "Community",
    },
    {
      path: "/dashboard/resources",
      icon: FaBook,
      label: "Resources",
    },
    {
      path: "/dashboard/support-bot",
      icon: FaRobot,
      label: "Support Bot",
    },
    {
      path: "/dashboard/settings",
      icon: FaCog,
      label: "Settings",
    },
  ];

  const quotes = [
    "Your body is not a problem to solve, but a miracle to understand.",
    "Self-care is not selfish, it's essential.",
    "You are worthy of rest, care, and kindness.",
    "Listen to your body, it knows the way.",
    "Every woman's journey is unique and beautiful.",
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, []);

  if (!user) return null;

  const isDashboardHome = location.pathname === "/dashboard";

  // Check if user has completed onboarding with period data
  const hasPeriodData = cycleData && cycleData.cycleLength > 0 && cycleData.periodDates && cycleData.periodDates.length > 0;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <motion.aside
        className="sidebar"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="brand">
          <motion.div
            className="brand-icon"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <GiFlowerStar />
          </motion.div>
          <span className="brand-title">HerCare</span>
          <small>Women Wellness</small>
        </div>

        <nav className="nav-menu">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink to={item.path} end={item.end}>
                <item.icon className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <motion.button
          className="logout-btn"
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignOutAlt /> Logout
        </motion.button>
      </motion.aside>

      {/* Main */}
      <motion.main
        className="main-content"
        variants={mainContentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Bar */}
        <div className="top-bar">
          <div className="greeting-section">
            <motion.div
              className="greeting-icon"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              🌸
            </motion.div>
            <div>
              <h2 className="greeting-text">
                {greeting}, <span className="highlight-name">{user.name || "Bhumiii"} 💖</span>
              </h2>
              <p className="user-subtext">Welcome back to your wellness space</p>
            </div>
          </div>

          <div className="top-bar-right">
            <motion.button
              className="report-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadReport}
            >
              <FaFileDownload />
              Download Report
            </motion.button>

            <div className="date-time">
              <span>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="time">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <motion.div
              className="notification-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              <span className="notification-badge">3</span>
            </motion.div>

            <motion.div
              className="user-avatar"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard/profile")}
              style={{ cursor: "pointer" }}
            >
              <FaUserCircle />
            </motion.div>
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              className="notifications-dropdown"
              variants={notificationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h4>Notifications</h4>
              <div className="notification-item">
                <span>🔔</span>
                <p>{hasPeriodData && cycleData.daysUntilPeriod !== null && cycleData.daysUntilPeriod >= 0 
                  ? `Your period is expected in ${cycleData.daysUntilPeriod} days`
                  : hasPeriodData && cycleData.daysUntilPeriod !== null && cycleData.daysUntilPeriod < 0
                  ? `Your period is ${Math.abs(cycleData.daysUntilPeriod)} days late`
                  : "Complete your period setup for predictions"}</p>
              </div>
              <div className="notification-item">
                <span>💪</span>
                <p>New mindfulness exercise available</p>
              </div>
              <div className="notification-item">
                <span>👥</span>
                <p>3 new messages in Community</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isDashboardHome && (
          <>
            {/* Welcome */}
            <motion.div
              className="welcome-section"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="page-title">Welcome Back, {user.name} 🌸</h1>
              <p className="page-subtitle">Your safe space for balance, care & confidence</p>
            </motion.div>

            {/* Quote */}
            <motion.div className="quote-card">
              <FaQuoteLeft className="quote-icon" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="quote-text"
                >
                  {quotes[currentQuote]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Cycle Status */}
            <motion.div
              className="cycle-status-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {loading ? (
                <div className="loading-placeholder">Loading your cycle data...</div>
              ) : !hasPeriodData ? (
                <div className="no-data-message">
                  <h3>🌸 Complete Your Period Setup</h3>
                  <p>Log your first period to see your cycle information and predictions.</p>
                  <button 
                    className="setup-btn"
                    onClick={() => navigate("/dashboard/period-tracker")}
                  >
                    Go to Period Tracker
                  </button>
                </div>
              ) : (
                <>
                  <div className="cycle-header">
                    <div>
                      <h2>🌸 Current Cycle</h2>
                      <p>{cycleData.phase}</p>
                    </div>
                    <div className="cycle-day-circle">
                      <span>Day</span>
                      <h1>{Math.min(cycleData.currentDay, cycleData.cycleLength)}</h1>
                    </div>
                  </div>

                  <div className="cycle-progress-container">
                    <div className="progress-info">
                      <span>Cycle Progress</span>
                      <span>
                        {Math.min(cycleData.currentDay, cycleData.cycleLength)}/{cycleData.cycleLength}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (cycleData.currentDay / cycleData.cycleLength) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="cycle-details">
                    <div className="detail-box">
                      <h4>🩸 Next Period</h4>
                      <p>{cycleData.daysUntilPeriod !== null && cycleData.daysUntilPeriod >= 0
                        ? `${cycleData.daysUntilPeriod} days`
                        : cycleData.daysUntilPeriod !== null && cycleData.daysUntilPeriod < 0
                        ? `${Math.abs(cycleData.daysUntilPeriod)} days late`
                        : "Not available"}</p>
                    </div>
                    <div className="detail-box">
                      <h4>💫 Phase</h4>
                      <p>{cycleData.phase}</p>
                    </div>
                    <div className="detail-box">
                      <h4>😊 Mood</h4>
                      <p>{cycleData.moodTrend}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Cards */}
            <motion.div className="dashboard-cards">
              <motion.div
                className="card"
                whileHover="hover"
                onClick={() => navigate("/dashboard/period-tracker")}
              >
                <div className="card-icon">📅</div>
                <h3>Track your cycle</h3>
                <p>Monitor your menstrual cycle, symptoms, and predictions</p>
                <span className="card-link">View Tracker →</span>
              </motion.div>

              <motion.div
                className="card"
                whileHover="hover"
                onClick={() => navigate("/dashboard/mindfulness")}
              >
                <div className="card-icon">🧘</div>
                <h3>Mindfulness</h3>
                <p>Guided meditations and breathing exercises</p>
                <span className="card-link">Start →</span>
              </motion.div>

              <motion.div
                className="card"
                whileHover="hover"
                onClick={() => navigate("/dashboard/community")}
              >
                <div className="card-icon">💬</div>
                <h3>Community support</h3>
                <p>Connect with women on similar journeys</p>
                <span className="card-link">Join →</span>
              </motion.div>
            </motion.div>
          </>
        )}

        <Outlet />
      </motion.main>
    </div>
  );
}