// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  Video,
  Settings,
  Scale,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Cases", path: "/cases", icon: Briefcase },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Documents", path: "/documents", icon: FileText },
  { name: "AI Assistant", path: "/ai", icon: MessageSquare },
  { name: "Calendar", path: "/calendar", icon: Calendar },
  { name: "Video Consult", path: "/video", icon: Video },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${collapsed ? "w-20" : "w-64"} h-screen bg-gray-50 border-[0.5px] border-gray-200 flex flex-col justify-between transition-all duration-300`}>
      
      {/* TOP */}
      <div>
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-green-700 text-white p-2 rounded-lg">
                <Scale size={18} />
              </div>
              <span className="font-semibold">LegalFlow</span>
            </div>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <div className="mt-4 px-2 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                {!collapsed && item.name}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className=" p-3">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
        >
          <Settings size={18} />
          {!collapsed && "Settings"}
        </NavLink>
      </div>
    </div>
  );
}