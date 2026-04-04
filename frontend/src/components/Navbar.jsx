import {
    Bell,
    Sun,
    Briefcase,
    XCircle,
    User,
    Settings,
    LogOut
  } from "lucide-react";
  
  import { useState, useRef, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  
  export default function Navbar() {
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
  
    const navigate = useNavigate();
  
    const notifRef = useRef(null);
    const profileRef = useRef(null);
  
    // 🔥 OUTSIDE CLICK HANDLER
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          notifRef.current &&
          !notifRef.current.contains(event.target)
        ) {
          setShowNotif(false);
        }
  
        if (
          profileRef.current &&
          !profileRef.current.contains(event.target)
        ) {
          setShowProfile(false);
        }
      }
  
      document.addEventListener("click", handleClickOutside);
  
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);
  
    const notifications = [
      {
        id: 1,
        title: "New Opportunity Posted",
        message: 'A new opportunity "test 19" is now available',
        time: "3/19/26, 3:09 PM",
        type: "info",
      },
      {
        id: 2,
        title: "Opportunity Removed",
        message: '"waste" is no longer available',
        time: "3/19/26, 3:09 PM",
        type: "info",
      },
      {
        id: 3,
        title: "Application Rejected",
        message: 'Your application for "waste" was rejected',
        time: "3/19/26, 3:08 PM",
        type: "error",
      },
      {
        id: 4,
        title: "Opportunity Updated",
        message: '"waste" has been updated',
        time: "3/19/26, 3:05 PM",
        type: "info",
      },
    ];

    const openprofile=()=>{
      console.log("Opening profile...");
      navigate("/profile");
    }
  
    return (
      <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-gray-200/60 bg-white/65 px-6 backdrop-blur-xl backdrop-saturate-150 supports-backdrop-filter:bg-white/55">
        
        {/* 🔍 SEARCH */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-[400px]">
          <input
            type="text"
            placeholder="Search cases, clients, documents..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
  
        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5 relative">
          
          {/* 🌞 THEME */}
          <Sun size={18} className="text-gray-600 cursor-pointer" />
  
          {/* 🔔 NOTIFICATIONS */}
          <div className="relative" ref={notifRef}>
            <Bell
              size={18}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                setShowNotif(!showNotif);
                setShowProfile(false);
              }}
            />
  
            {/* COUNT */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
              {notifications.length}
            </span>
  
            {/* DROPDOWN */}
            {showNotif && (
              <div className="absolute right-0 top-10 w-[360px] bg-white rounded-xl shadow-xl z-50">
                
                {/* HEADER */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                  <h2 className="font-semibold">Notifications</h2>
                  <button className="text-sm text-green-600 hover:underline">
                    Mark all as read
                  </button>
                </div>
  
                {/* LIST */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      {/* ICON */}
                      <div className="mt-1">
                        {item.type === "error" ? (
                          <XCircle className="text-red-500" size={18} />
                        ) : (
                          <Briefcase className="text-yellow-500" size={18} />
                        )}
                      </div>
  
                      {/* TEXT */}
                      <div className="text-sm">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-gray-500">{item.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          {/* 👤 PROFILE */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            ref={profileRef}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
          >
            <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-medium">
              S
            </div>
  
            <div className="text-sm hidden sm:block">
              <p className="font-medium">Sarah Mitchell</p>
              <p className="text-gray-500 text-xs">Senior Partner</p>
            </div>
          </div>
  
          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl z-50">
              
              <div className="px-4 py-3 border-b">
                <p className="font-medium">Sarah Mitchell</p>
                <p className="text-xs text-gray-500">Senior Partner</p>
              </div>
  
              <div className="p-2 text-sm space-y-1">
                <button onClick={openprofile} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                  <User size={16} />
                  View Profile 
                </button>
  
                <button onClick={()=>navigate("/settings")} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
                  <Settings size={16} />
                  Settings
                </button>
  
                <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }