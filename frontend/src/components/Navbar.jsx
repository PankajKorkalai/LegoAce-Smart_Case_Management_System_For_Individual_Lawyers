// components/Navbar.jsx
import { Bell, Sun } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between bg-white p-4 border-[0.5px] border-gray-200">
      
      {/* Search */}
      <input
        type="text"
        placeholder="Search cases, clients, documents..."
        className="w-1/3 px-4 py-2 border-[0.5px] border-gray-200 focus:outline-none"
      />

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        <Sun className="text-gray-500 cursor-pointer" />

        <div className="relative">
          <Bell className="text-gray-500 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full">
            S
          </div>
          <div className="text-sm">
            <p className="font-medium">Sarah Mitchell</p>
            <p className="text-gray-500 text-xs">Senior Partner</p>
          </div>
        </div>

      </div>
    </div>
  );
}