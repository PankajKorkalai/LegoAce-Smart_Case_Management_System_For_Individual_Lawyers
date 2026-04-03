// components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Users,
  FileText,
  Bot,
  Calendar,
  Video,
  Settings
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
  { name: "Cases", path: "/cases", icon: <Folder size={18} /> },
  { name: "Clients", path: "/clients", icon: <Users size={18} /> },
  { name: "Documents", path: "/documents", icon: <FileText size={18} /> },
  { name: "AI Assistant", path: "/ai", icon: <Bot size={18} /> },
  { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
  { name: "Video Consult", path: "/video", icon: <Video size={18} /> },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between">
      
      {/* Top */}
      <div>
        <div className="p-4 flex items-center gap-2 font-bold text-lg">
          ⚖️ <span>LegalFlow</span>
        </div>

        <div className="px-3 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-3">
        <div className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
          <Settings size={18} />
          Settings
        </div>
      </div>
    </div>
  );
}