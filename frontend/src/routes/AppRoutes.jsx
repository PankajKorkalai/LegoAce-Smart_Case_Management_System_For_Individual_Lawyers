import { Routes, Route } from "react-router-dom";

// ✅ correct paths (../pages)
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Cases from "../pages/Cases";
import Clients from "../pages/Clients";
import Documents from "../pages/Documents";
import Calendar from "../pages/Calendar";
import Video from "../pages/Video";
import Settings from "../pages/Settings";

// ❗ optional (only if file exists)
import AI from "../pages/AI";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/video" element={<Video />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />

      {/* optional */}
      <Route path="/ai" element={<AI />} />
    </Routes>
  );
}