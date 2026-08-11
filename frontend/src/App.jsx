import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";

/* Dashboard sub-pages */
import PeriodTracker from "./pages/PeriodTracker";
import DietCare from "./pages/DietCare";
import Mindfulness from "./pages/Mindfulness";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import SupportBot from "./pages/SupportBot";
import Education from "./pages/Education";
import Settings from "./pages/Settings";

import PeriodExercise from "./pages/PeriodExercise";
import Yoga from "./pages/Yoga";
import Meditation from "./pages/Meditation";
import Exercise from "./pages/Exercise";
import Articles from "./pages/Articles";

/* Profile */
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />


      {/* =========================
          DASHBOARD
      ========================== */}

      <Route path="/dashboard" element={<Dashboard />}>

        {/* Dashboard Home */}
        <Route index element={null} />

        {/* Period Tracker */}
        <Route
          path="period-tracker"
          element={<PeriodTracker />}
        />

        {/* Diet & Care */}
        <Route
          path="diet-care"
          element={<DietCare />}
        />

        {/* Mindfulness */}
        <Route
          path="mindfulness"
          element={<Mindfulness />}
        />

        <Route
          path="mindfulness/period-exercise"
          element={<PeriodExercise />}
        />

        <Route
          path="mindfulness/yoga"
          element={<Yoga />}
        />

        <Route
          path="mindfulness/meditation"
          element={<Meditation />}
        />

        <Route
          path="mindfulness/exercise"
          element={<Exercise />}
        />

        {/* Community */}
        <Route
          path="community"
          element={<Community />}
        />

        {/* Resources */}
        <Route
          path="resources"
          element={<Resources />}
        />

        {/* Support Bot */}
        <Route
          path="support-bot"
          element={<SupportBot />}
        />

        {/* Education */}
        <Route
          path="education"
          element={<Education />}
        />

        {/* Settings */}
        <Route
          path="settings"
          element={<Settings />}
        />

        {/* Profile */}
        <Route
          path="profile"
          element={<Profile />}
        />

        {/* Articles */}
        <Route
          path="articles"
          element={<Articles />}
        />

      </Route>


      {/* =========================
          FALLBACK
      ========================== */}

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
  );
}

export default App;