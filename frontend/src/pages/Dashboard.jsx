// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaLeaf,
  FaUsers,
  FaBook,
  FaRobot,
  FaCog,
  FaSignOutAlt,
  FaQuoteLeft,
  FaBell,
  FaUserCircle,
  FaFileDownload,
  FaHeart,
  FaChartLine,
} from "react-icons/fa";

import { GiFlowerStar } from "react-icons/gi";

import api from "../api";
import "../styles/Dashboard.css";

export default function Dashboard() {

  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [cycleData, setCycleData] = useState({
    currentDay: 0,
    cycleLength: 28,
    phase: "No Data",
    nextPeriod: "Not available",
    daysUntilPeriod: null,
    lastPeriodDate: null,
    predictedPeriodDate: null,
    periodDates: [],
    predictedPeriodDays: [],
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      updateGreeting();

      fetchDashboardData(parsedUser.email);

    } catch (error) {

      console.error("Invalid user data:", error);

      localStorage.removeItem("user");

      navigate("/login");
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000);

    return () => clearInterval(timer);

  }, [navigate]);


  // =====================================================
  // GREETING
  // =====================================================

  const updateGreeting = () => {

    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

  };


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const getTodayString = () => {

    const today = new Date();

    return new Date(
      today.getTime() -
      today.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

  };


  // =====================================================
  // CALCULATE CYCLE DAY
  // =====================================================

  const calculateCycleDay = (lastPeriodDate, cycleLength) => {

    if (!lastPeriodDate) {
      return 0;
    }

    const start = new Date(lastPeriodDate);
    const today = new Date();

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = Math.floor(
      (today - start) / (1000 * 60 * 60 * 24)
    );

    let day = difference + 1;

    /*
      If current cycle has gone beyond the
      predicted cycle length, keep showing
      the current day rather than resetting.
    */

    if (day < 1) {
      day = 1;
    }

    return day;

  };


  // =====================================================
  // CALCULATE PHASE
  // =====================================================

  const calculatePhase = (cycleDay, cycleLength) => {

    if (!cycleDay) {
      return "No Data";
    }

    /*
      Menstrual:
      Days 1-5

      Follicular:
      Days 6-14

      Ovulation:
      Around days 14-16

      Luteal:
      Remaining days
    */

    if (cycleDay <= 5) {
      return "Menstrual Phase";
    }

    if (cycleDay <= 13) {
      return "Follicular Phase";
    }

    if (cycleDay <= 16) {
      return "Ovulation Phase";
    }

    return "Luteal Phase";

  };


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async (email) => {

    try {

      setLoading(true);

      // Get dashboard prediction
      const dashboardResponse =
        await api.get(`/dashboard/${email}`);

      // Get actual logged dates
      const periodResponse =
        await api.get(`/period-dates/${email}`);

      const dashboard = dashboardResponse.data;
      const periodData = periodResponse.data;

      const periodDates =
        periodData.period_dates || [];

      const predictedDays =
        dashboard.predicted_period_days ||
        periodData.predicted_period_days ||
        [];

      const cycleLength =
        Number(dashboard.avg_cycle) || 28;

      const predictedPeriod =
        dashboard.next_predicted_period || "";

      // Last logged period
      let lastPeriodDate = null;

      if (periodDates.length > 0) {

        const sortedDates = [...periodDates].sort();

        lastPeriodDate =
          sortedDates[sortedDates.length - 1];

      }

      // Calculate current cycle day
      const currentDay =
        calculateCycleDay(
          lastPeriodDate,
          cycleLength
        );

      // Calculate phase
      const phase =
        calculatePhase(
          currentDay,
          cycleLength
        );

      // Calculate days until next period
      let daysUntilPeriod = null;

      if (predictedPeriod) {

        const today = new Date();
        const next = new Date(predictedPeriod);

        today.setHours(0, 0, 0, 0);
        next.setHours(0, 0, 0, 0);

        daysUntilPeriod = Math.ceil(
          (next - today) /
          (1000 * 60 * 60 * 24)
        );

      }

      setCycleData({

        currentDay,

        cycleLength,

        phase,

        nextPeriod:
          daysUntilPeriod !== null
            ? daysUntilPeriod >= 0
              ? `In ${daysUntilPeriod} days`
              : `${Math.abs(daysUntilPeriod)} days late`
            : "Not available",

        daysUntilPeriod,

        lastPeriodDate,

        predictedPeriodDate:
          predictedPeriod || null,

        periodDates,

        predictedPeriodDays:
          predictedDays,

      });

    } catch (error) {

      console.error(
        "❌ Dashboard fetch error:",
        error
      );

      setCycleData({
        currentDay: 0,
        cycleLength: 28,
        phase: "No Data",
        nextPeriod: "Not available",
        daysUntilPeriod: null,
        lastPeriodDate: null,
        predictedPeriodDate: null,
        periodDates: [],
        predictedPeriodDays: [],
      });

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // DOWNLOAD REPORT (PDF)
  // =====================================================

  const downloadReport = async () => {
    try {
      const response = await api.get(`/download-report/${user.email}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "HerCare_Wellness_Report.pdf");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ REPORT DOWNLOAD ERROR:", error);
      alert("Unable to download report. Please try again.");
    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  // =====================================================
  // SIDEBAR
  // =====================================================

  const sidebarVariants = {

    hidden: {
      x: -280,
      opacity: 0
    },

    visible: {
      x: 0,
      opacity: 1,

      transition: {
        duration: 0.4,
        ease: "easeOut"
      }

    }

  };


  const navItems = [

    {
      path: "/dashboard",
      icon: FaTachometerAlt,
      label: "Dashboard",
      end: true
    },

    {
      path: "/dashboard/period-tracker",
      icon: FaCalendarAlt,
      label: "Period Tracker"
    },

    {
      path: "/dashboard/mindfulness",
      icon: FaLeaf,
      label: "Mindfulness"
    },

    {
      path: "/dashboard/community",
      icon: FaUsers,
      label: "Community"
    },

    {
      path: "/dashboard/articles",
      icon: FaBook,
      label: "Articles"
    },

    {
      path: "/dashboard/resources",
      icon: FaBook,
      label: "Resources"
    },

    {
      path: "/dashboard/support-bot",
      icon: FaRobot,
      label: "Support Bot"
    },

    {
      path: "/dashboard/settings",
      icon: FaCog,
      label: "Settings"
    }

  ];


  // =====================================================
  // QUOTES
  // =====================================================

  const quotes = [

    "Your body is not a problem to solve, but a miracle to understand.",

    "Self-care is not selfish, it's essential.",

    "You are worthy of rest, care, and kindness.",

    "Listen to your body, it knows the way."

  ];

  const [currentQuote, setCurrentQuote] =
    useState(0);


  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentQuote(
        previous =>
          (previous + 1) %
          quotes.length
      );

    }, 8000);

    return () =>
      clearInterval(interval);

  }, []);


  // =====================================================
  // CHECK HOME
  // =====================================================

  const isDashboardHome =
    location.pathname === "/dashboard";


  // =====================================================
  // RENDER
  // =====================================================

  if (!user) {
    return null;
  }


  return (

    <div className="app-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <motion.aside
        className="sidebar"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >

        <div className="brand">

          <motion.div
            className="brand-icon"

            whileHover={{
              rotate: 360,
              scale: 1.1
            }}

            transition={{
              duration: 0.5
            }}
          >

            <GiFlowerStar />

          </motion.div>

          <span className="brand-title">
            Her
            <span style={{ color: "#D47E8E" }}>
              CARE
            </span>
          </span>

          <small>
            Women's Wellness
          </small>

        </div>


        <nav className="nav-menu">

          {navItems.map(
            (item, index) => (

              <motion.div
                key={item.path}

                initial={{
                  opacity: 0,
                  x: -20
                }}

                animate={{
                  opacity: 1,
                  x: 0
                }}

                transition={{
                  delay: index * 0.05
                }}
              >

                <NavLink
                  to={item.path}
                  end={item.end}
                >

                  <item.icon
                    className="nav-icon"
                  />

                  <span>
                    {item.label}
                  </span>

                </NavLink>

              </motion.div>

            )
          )}

        </nav>


        <motion.button
          className="logout-btn"
          onClick={logout}

          whileHover={{
            scale: 1.02
          }}

          whileTap={{
            scale: 0.95
          }}
        >

          <FaSignOutAlt />

          Logout

        </motion.button>

      </motion.aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="top-bar">

          <div className="greeting-section">

            <div className="greeting-avatar">

              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                alt="Profile"
                className="avatar-img"
              />

              <div>

                <h2 className="greeting-text">

                  {greeting},

                  <span className="highlight-name">

                    {" "}
                    {user.displayName ||
                      user.name ||
                      "User"}

                  </span>

                  {" "}🌸

                </h2>

                <p className="user-subtext">

                  Welcome back to your wellness journey

                </p>

              </div>

            </div>

          </div>


          <div className="top-bar-right">


            <motion.button
              className="report-btn"

              whileHover={{
                scale: 1.02
              }}

              whileTap={{
                scale: 0.95
              }}

              onClick={downloadReport}
            >

              <FaFileDownload />

              Download Report

            </motion.button>


            <div className="date-time">

              <span>

                {currentTime.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                  }
                )}

              </span>

              <span className="time">

                {currentTime.toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                )}

              </span>

            </div>


            {/* NOTIFICATION */}

            <motion.div
              className="notification-icon"

              whileHover={{
                scale: 1.05
              }}

              whileTap={{
                scale: 0.95
              }}

              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell />

              <span className="notification-badge">
                3
              </span>

            </motion.div>


            {/* PROFILE */}

            <motion.div
              className="user-avatar"

              whileHover={{
                scale: 1.05
              }}

              whileTap={{
                scale: 0.95
              }}

              onClick={() =>
                navigate("/dashboard/profile")
              }
            >

              <FaUserCircle />

            </motion.div>

          </div>

        </div>


        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <AnimatePresence>

          {showNotifications && (

            <motion.div
              className="notifications-dropdown"

              initial={{
                opacity: 0,
                y: -20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              exit={{
                opacity: 0,
                y: -20
              }}
            >

              <h4>
                🔔 Notifications
              </h4>


              <div className="notification-item">

                <span>📅</span>

                <p>

                  {cycleData.daysUntilPeriod !== null

                    ? cycleData.daysUntilPeriod >= 0

                      ? `Your period is expected in ${cycleData.daysUntilPeriod} days`

                      : `Your period is ${Math.abs(
                          cycleData.daysUntilPeriod
                        )} days late`

                    : "Complete your period setup for predictions"}

                </p>

              </div>


              <div className="notification-item">

                <span>🧘</span>

                <p>
                  New mindfulness exercise available
                </p>

              </div>


              <div className="notification-item">

                <span>💬</span>

                <p>
                  Check the HerCare community
                </p>

              </div>

            </motion.div>

          )}

        </AnimatePresence>


        {/* =================================================
            DASHBOARD HOME
        ================================================= */}

        {isDashboardHome && (

          <div className="dashboard-home">


            {/* =============================================
                GOOD MORNING
            ============================================= */}

            <section className="dashboard-welcome">

              <span className="welcome-label">
                HERCARE WELLNESS
              </span>

              <h1>

                {greeting},

                <span>
                  {" "}
                  {user.displayName ||
                    user.name ||
                    "User"}
                </span>

                🌸

              </h1>

              <p>
                Here's a gentle look at your cycle
                and today's wellness journey.
              </p>

            </section>


            {/* =============================================
                STAT CARDS
            ============================================= */}

            <section className="dashboard-stats">


              {/* CYCLE DAY */}

              <motion.div
                className="dashboard-stat-card"

                initial={{
                  opacity: 0,
                  y: 20
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}
              >

                <div className="dashboard-stat-icon">
                  <FaCalendarAlt />
                </div>

                <div>

                  <span>
                    Cycle Day
                  </span>

                  <strong>

                    {loading
                      ? "..."
                      : cycleData.currentDay > 0
                        ? `Day ${cycleData.currentDay}`
                        : "Day —"}

                  </strong>

                </div>

              </motion.div>


              {/* NEXT PERIOD */}

              <motion.div
                className="dashboard-stat-card"

                initial={{
                  opacity: 0,
                  y: 20
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                transition={{
                  delay: 0.1
                }}
              >

                <div className="dashboard-stat-icon">
                  <FaHeart />
                </div>

                <div>

                  <span>
                    Next Period
                  </span>

                  <strong>

                    {loading
                      ? "..."
                      : cycleData.nextPeriod}

                  </strong>

                </div>

              </motion.div>


              {/* AVG CYCLE */}

              <motion.div
                className="dashboard-stat-card"

                initial={{
                  opacity: 0,
                  y: 20
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                transition={{
                  delay: 0.2
                }}
              >

                <div className="dashboard-stat-icon">
                  <FaChartLine />
                </div>

                <div>

                  <span>
                    Avg Cycle
                  </span>

                  <strong>

                    {cycleData.cycleLength}
                    {" "}days

                  </strong>

                </div>

              </motion.div>


              {/* PHASE */}

              <motion.div
                className="dashboard-stat-card"

                initial={{
                  opacity: 0,
                  y: 20
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                transition={{
                  delay: 0.3
                }}
              >

                <div className="dashboard-stat-icon">
                  <FaLeaf />
                </div>

                <div>

                  <span>
                    Phase
                  </span>

                  <strong>

                    {loading
                      ? "..."
                      : cycleData.phase}

                  </strong>

                </div>

              </motion.div>

            </section>


            {/* =============================================
                CYCLE PROGRESS
            ============================================= */}

            <motion.section
              className="cycle-progress-card"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.4
              }}
            >

              <div className="cycle-progress-header">

                <div>

                  <span>
                    YOUR MENSTRUAL CYCLE
                  </span>

                  <h2>
                    Cycle Progress
                  </h2>

                </div>

                <div className="cycle-day-display">

                  Day{" "}

                  <strong>
                    {cycleData.currentDay || "—"}
                  </strong>

                  {" / "}

                  {cycleData.cycleLength}

                </div>

              </div>


              {/* PROGRESS BAR */}

              <div className="cycle-line-wrapper">

                <div className="cycle-line">

                  <motion.div
                    className="cycle-line-fill"

                    initial={{
                      width: 0
                    }}

                    animate={{
                      width:
                        cycleData.currentDay > 0
                          ? `${Math.min(
                              (cycleData.currentDay /
                                cycleData.cycleLength) *
                                100,
                              100
                            )}%`
                          : "0%"
                    }}

                    transition={{
                      duration: 1
                    }}
                  />

                </div>


                <div className="cycle-markers">

                  <div>

                    <span className="marker menstrual">
                      1
                    </span>

                    <small>
                      Menstrual
                      <br />
                      Days 1–5
                    </small>

                  </div>


                  <div>

                    <span className="marker follicular">
                      6
                    </span>

                    <small>
                      Follicular
                      <br />
                      Days 6–13
                    </small>

                  </div>


                  <div>

                    <span className="marker ovulation">
                      14
                    </span>

                    <small>
                      Ovulation
                      <br />
                      Days 14–16
                    </small>

                  </div>


                  <div>

                    <span className="marker luteal">
                      17
                    </span>

                    <small>
                      Luteal
                      <br />
                      Remaining days
                    </small>

                  </div>

                </div>

              </div>


              {/* CURRENT PHASE */}

              <div className="current-phase-box">

                <div className="phase-icon">

                  {cycleData.phase ===
                  "Menstrual Phase"
                    ? "🩸"
                    : cycleData.phase ===
                      "Follicular Phase"
                      ? "🌱"
                      : cycleData.phase ===
                        "Ovulation Phase"
                        ? "🌸"
                        : "🌙"}

                </div>

                <div>

                  <span>
                    CURRENT PHASE
                  </span>

                  <h3>
                    {cycleData.phase}
                  </h3>

                </div>

              </div>

            </motion.section>


            {/* =============================================
                TODAY'S WELLNESS TIPS
            ============================================= */}

            <motion.section
              className="wellness-tips-section"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.5
              }}
            >

              <div className="section-heading">

                <div>

                  <span>
                    DAILY CARE
                  </span>

                  <h2>
                    Today's Wellness Tips 🌸
                  </h2>

                </div>

              </div>


              <div className="wellness-tips-grid">


                <div className="wellness-tip-card">

                  <div className="tip-icon">
                    💧
                  </div>

                  <h3>
                    Stay Hydrated
                  </h3>

                  <p>
                    Drink enough water throughout
                    the day to support your body
                    and energy levels.
                  </p>

                </div>


                <div className="wellness-tip-card">

                  <div className="tip-icon">
                    🥗
                  </div>

                  <h3>
                    Nourish Your Body
                  </h3>

                  <p>
                    Choose balanced meals with
                    vegetables, fruits, protein
                    and whole grains.
                  </p>

                </div>


                <div className="wellness-tip-card">

                  <div className="tip-icon">
                    🧘
                  </div>

                  <h3>
                    Take a Moment
                  </h3>

                  <p>
                    Give yourself a few quiet
                    minutes today for breathing,
                    stretching or relaxation.
                  </p>

                </div>

              </div>

            </motion.section>


            {/* =============================================
                QUOTE
            ============================================= */}

            <motion.div
              className="quote-card"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.6
              }}
            >

              <FaQuoteLeft
                className="quote-icon"
              />

              <AnimatePresence mode="wait">

                <motion.p
                  key={currentQuote}

                  initial={{
                    opacity: 0,
                    y: 10
                  }}

                  animate={{
                    opacity: 1,
                    y: 0
                  }}

                  exit={{
                    opacity: 0,
                    y: -10
                  }}
                >

                  "{quotes[currentQuote]}"

                </motion.p>

              </AnimatePresence>

            </motion.div>


            {/* =============================================
                QUICK ACTIONS
            ============================================= */}

            <section className="quick-actions">

              <h2>
                Quick Actions
              </h2>

              <div className="action-grid">

                <motion.div
                  className="action-card"

                  whileHover={{
                    y: -4
                  }}

                  onClick={() =>
                    navigate(
                      "/dashboard/period-tracker"
                    )
                  }
                >

                  <div className="action-icon">
                    📅
                  </div>

                  <h4>
                    Log Period
                  </h4>

                  <p>
                    Track your cycle
                  </p>

                </motion.div>


                <motion.div
                  className="action-card"

                  whileHover={{
                    y: -4
                  }}

                  onClick={() =>
                    navigate(
                      "/dashboard/mindfulness"
                    )
                  }
                >

                  <div className="action-icon">
                    🧘
                  </div>

                  <h4>
                    Mindfulness
                  </h4>

                  <p>
                    Find your calm
                  </p>

                </motion.div>


                <motion.div
                  className="action-card"

                  whileHover={{
                    y: -4
                  }}

                  onClick={() =>
                    navigate(
                      "/dashboard/community"
                    )
                  }
                >

                  <div className="action-icon">
                    💬
                  </div>

                  <h4>
                    Community
                  </h4>

                  <p>
                    Connect with others
                  </p>

                </motion.div>


                <motion.div
                  className="action-card"

                  whileHover={{
                    y: -4
                  }}

                  onClick={downloadReport}
                >

                  <div className="action-icon">
                    📄
                  </div>

                  <h4>
                    Report
                  </h4>

                  <p>
                    Download insights
                  </p>

                </motion.div>

              </div>

            </section>

          </div>

        )}


        {/* =================================================
            CHILD ROUTES
        ================================================= */}

        <Outlet />

      </main>

    </div>

  );

}