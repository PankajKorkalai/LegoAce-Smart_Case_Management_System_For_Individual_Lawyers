// App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import AuthRoutes from "./routes/AuthRoutes";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen">

      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className={`min-h-screen bg-gray-50 transition-[margin] duration-300 ease-out ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar />

        <div className="p-6">
          <AppRoutes />
          <AuthRoutes/>
        </div>
      </div>
    </div>
  );
}