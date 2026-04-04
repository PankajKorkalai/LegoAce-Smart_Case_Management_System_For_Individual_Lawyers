// App.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import AuthRoutes from "./routes/AuthRoutes";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Paths where we want a full page view without the Sidebar and Navbar
  const bypassLayoutPaths = ["/", "/auth"];
  const isLayoutBypassed = bypassLayoutPaths.includes(location.pathname);

  return (
    <div className="min-h-screen relative">
      {!isLayoutBypassed && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      )}

      <div
        className={`min-h-screen bg-gray-50 transition-[margin] duration-300 ease-out ${
          isLayoutBypassed ? "ml-0" : sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {!isLayoutBypassed && <Navbar />}

        <div className={isLayoutBypassed ? "" : "p-6"}>
          <AppRoutes />
          <AuthRoutes/>
        </div>
      </div>
    </div>
  );
}