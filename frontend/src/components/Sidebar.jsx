// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
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

export default function Sidebar({ collapsed, onCollapsedChange }) {
  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col justify-between overflow-y-auto overscroll-y-contain border-r border-gray-200/70 bg-gray-50/90 backdrop-blur-xl backdrop-saturate-150 transition-[width] duration-300 ease-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      
      {/* TOP */}
      <div>
        <div
          className={`flex h-14 shrink-0 items-center border-b border-gray-200/60 px-4 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-green-700 text-white p-2 rounded-lg">
                <Scale size={18} />
              </div>
              <span className="font-semibold">LegalFlow</span>
            </div>
          )}

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => onCollapsedChange(!collapsed)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <div className="mt-3 px-2 space-y-1">
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
      <div className="border-t border-gray-200/35 p-3">
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