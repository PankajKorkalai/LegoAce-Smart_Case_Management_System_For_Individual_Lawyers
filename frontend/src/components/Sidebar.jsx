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
  ChevronRight,
  Star,
  IdCard,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Cases", path: "/cases", icon: Briefcase },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Documents", path: "/documents", icon: FileText },
  { name: "Feedback", path: "/feedback", icon: Star },
  { name: "AI Assistant", path: "/ai", icon: MessageSquare },
  { name: "Calendar", path: "/calendar", icon: Calendar },
  { name: "Video Consult", path: "/video", icon: Video },
  { name: "Public Profile", path: "/p/demo", icon: IdCard },
];

export default function Sidebar({ collapsed, onCollapsedChange }) {
  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col justify-between overflow-hidden border-r border-gray-200/70 bg-gray-50/90 backdrop-blur-xl backdrop-saturate-150 transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      
      {/* TOP */}
      <div className="flex flex-col h-full overflow-hidden">
        <div
          className={`flex shrink-0 items-center border-b border-gray-200/60 transition-all duration-300 ${
            collapsed ? "h-24 flex-col justify-center gap-3" : "h-14 flex-row justify-between px-4"
          }`}
        >
          <div className="flex items-center">
            <div className="bg-green-700 text-white p-2 rounded-lg shrink-0">
              <Scale size={18} />
            </div>
            <span 
              className={`font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-2"
              }`}
            >
              LegoAce
            </span>
          </div>

          <button
            type="button"
            className="shrink-0 p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => onCollapsedChange(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="mt-3 px-3 space-y-1 flex-1 overflow-y-auto overscroll-y-contain custom-scrollbar">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  } ${collapsed ? "justify-center" : "justify-start"}`
                }
              >
                <Icon size={20} className="shrink-0" />
                <span 
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200/35 p-3 shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors ${
              isActive
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:bg-gray-100"
            } ${collapsed ? "justify-center" : "justify-start"}`
          }
        >
          <Settings size={20} className="shrink-0" />
          <span 
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            }`}
          >
            Settings
          </span>
        </NavLink>
      </div>
    </div>
  );
}