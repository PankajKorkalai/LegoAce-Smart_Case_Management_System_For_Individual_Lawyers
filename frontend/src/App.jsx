// App.jsx
import { useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Paths where we want a full page view without the Sidebar and Navbar
  const bypassLayoutPaths = ["/", "/auth", "/login", "/feedback-form"];
  
  const layoutPathsPattern = [
    "/dashboard", "/cases", "/clients", "/documents",
    "/feedback", "/calendar", "/video", "/settings", "/profile", "/ai"
  ];
  const hasLayout = layoutPathsPattern.some(path => matchPath({ path, end: true }, location.pathname));

  const isLayoutBypassed =
    bypassLayoutPaths.includes(location.pathname) ||
    location.pathname.startsWith("/p/") ||
    !hasLayout;

  // Handles sidebar toggle from Navbar on mobile
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {!isLayoutBypassed && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          mobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`min-h-screen bg-gray-50 transition-all duration-300 ease-out ${
          isLayoutBypassed 
            ? "ml-0" 
            : sidebarCollapsed 
              ? "lg:ml-20 ml-0" 
              : "lg:ml-64 ml-0"
        }`}
      >
        {!isLayoutBypassed && (
          <Navbar onMenuClick={toggleMobileMenu} />
        )}

        <div className={isLayoutBypassed ? "" : "p-4 sm:p-6"}>
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}