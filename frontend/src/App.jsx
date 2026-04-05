// App.jsx
import { useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Paths where we want a full page view without the Sidebar and Navbar
  const bypassLayoutPaths = ["/", "/auth", "/login"];
  
  const layoutPathsPattern = [
    "/dashboard", "/cases", "/clients", "/documents",
    "/feedback", "/calendar", "/video", "/settings", "/profile", "/ai"
  ];
  const hasLayout = layoutPathsPattern.some(path => matchPath({ path, end: true }, location.pathname));

  const isLayoutBypassed =
    bypassLayoutPaths.includes(location.pathname) ||
    location.pathname.startsWith("/p/") ||
    !hasLayout;

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
        </div>
      </div>
    </div>
  );
}