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

/* 🔥 ADD THIS */
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />}>

        {/* 🔥 ADD INDEX ROUTE (fix blank dashboard issue) */}
        <Route index element={null} />



        <Route path="period-tracker" element={<PeriodTracker />} />
        <Route path="diet-care" element={<DietCare />} />
          <Route path="mindfulness" element={<Mindfulness />} />
          <Route path="mindfulness/period-exercise" element={<PeriodExercise />} />
          <Route path="mindfulness/yoga" element={<Yoga />} />
          <Route path="mindfulness/meditation" element={<Meditation />} />
          <Route path="mindfulness/exercise" element={<Exercise />} />
        

        <Route path="community" element={<Community />} />
        <Route path="resources" element={<Resources />} />
        <Route path="support-bot" element={<SupportBot />} />
        <Route path="education" element={<Education />} />
        <Route path="settings" element={<Settings />} />

        {/* ✅🔥 PROFILE ROUTE (MAIN FIX) */}
        <Route path="profile" element={<Profile />} />

      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;