import {
    Bell,
    Sun,
    Briefcase,
    XCircle,
    User,
    Settings,
    LogOut,
    MessageSquare,
    Video,
    Menu
  } from "lucide-react";
  
  import { useState, useRef, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  export default function Navbar({ onMenuClick }) {
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [userFullName, setUserFullName] = useState("");
  
    const navigate = useNavigate();
  
    const notifRef = useRef(null);
    const profileRef = useRef(null);
  
    const userName = localStorage.getItem("name") || "User";
    const userInitials = (userFullName || userName).charAt(0).toUpperCase();

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
  
      // Fetch profile pic and real name
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await fetch(`${apiUrl}/user/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            if (data.profilePicture?.url) {
              setProfilePic(data.profilePicture.url);
            }
            if (data.firstName && data.lastName) {
              setUserFullName(`${data.firstName} ${data.lastName}`);
            } else if (data.name) {
              setUserFullName(data.name);
            }
          }
        } catch (err) {
          console.error("Navbar profile fetch failed:", err);
        }
      };

      fetchProfile();

      // Listen for profile updates (custom event)
      const handleProfileUpdate = () => fetchProfile();
      window.addEventListener("profileUpdated", handleProfileUpdate);
  
      return () => {
        document.removeEventListener("click", handleClickOutside);
        window.removeEventListener("profileUpdated", handleProfileUpdate);
      };
    }, []);
  
    const notifications = [
      {
        id: 1,
        title: "Next Hearing Scheduled",
        message: 'Smith vs. Johnson: Hearing on Feb 15, 2026',
        time: "Just now",
        type: "hearing",
      },
      {
        id: 2,
        title: "Case Update",
        message: 'Davis Property Dispute status changed to Active',
        time: "2 hours ago",
        type: "update",
      },
      {
        id: 3,
        title: "Feedback Received",
        message: 'Maria Rodriguez submitted a 5-star review',
        time: "Yesterday, 3:08 PM",
        type: "feedback",
      },
      {
        id: 4,
        title: "Next Meeting",
        message: 'Client intake meeting with Robert Davis',
        time: "Yesterday, 1:00 PM",
        type: "meeting",
      },
    ];

    const openprofile=()=>{
      console.log("Opening profile...");
      navigate("/profile");
    }
  
    return (
      <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-gray-200/60 bg-white/65 px-4 sm:px-6 backdrop-blur-xl backdrop-saturate-150 supports-backdrop-filter:bg-white/55">
        
        <div className="flex items-center gap-4 flex-1">
          {/* 🍔 MOBILE MENU TOGGLE */}
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>

          {/* 🔍 SEARCH - Responsive Width */}
          <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full max-w-[400px]">
            <input
              type="text"
              placeholder="Search cases, clients..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>
  
        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-5 relative">
          
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
                  <button className="text-sm text-green-600">
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
                        {item.type === "hearing" && <Briefcase className="text-blue-500" size={18} />}
                        {item.type === "update" && <Bell className="text-yellow-500" size={18} />}
                        {item.type === "feedback" && <MessageSquare className="text-green-500" size={18} />}
                        {item.type === "meeting" && <Video className="text-purple-500" size={18} />}
                        {!["hearing", "update", "feedback", "meeting"].includes(item.type) && <Bell className="text-gray-500" size={18} />}
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-700 text-white flex items-center justify-center font-medium">
                  {userInitials}
                </div>
              )}
            </div>
  
            <div className="text-sm hidden sm:block">
              <p className="font-medium">{userFullName || userName}</p>
              <p className="text-gray-500 text-xs text-left">Legal Professional</p>
            </div>
          </div>
  
          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl z-50">
              
              <div className="px-4 py-3 border-b flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
                  {profilePic ? (
                    <img src={profilePic} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">
                      {userInitials}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm leading-tight">{userFullName || userName}</p>
                  <p className="text-[11px] text-gray-500">Legal Professional</p>
                </div>
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
  
                <button 
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userName");
                    navigate("/login");
                  }} 
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600"
                >
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