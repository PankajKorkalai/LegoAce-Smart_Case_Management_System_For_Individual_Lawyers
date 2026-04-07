import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Copy,
  Video as VideoIcon,
  Plus,
  Link,
  X // For the modal close button
} from "lucide-react";

export default function Video() {
  // --- STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  
  const [users, setUsers] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]); // State for dynamic meetings

  // --- FETCH MEETINGS FROM BACKEND ---
  const fetchMeetings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/meetings/upcoming");
      const data = await response.json();
      setUpcomingMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  // Load meetings when the component mounts
  useEffect(() => {
    fetchMeetings();
  }, []);

  // --- FETCH USERS FROM BACKEND ---
  useEffect(() => {
    // Only fetch users if the modal is opened to save unnecessary API calls
    if (isModalOpen) {
      const fetchUsers = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/meetings/users");
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [isModalOpen]);

  // --- HANDLE FORM SUBMISSION ---
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmail) return;

    setStatus("loading");

    try {
      const response = await fetch("http://localhost:5000/api/meetings/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedEmail }),
      });

      if (response.ok) {
        setStatus("success");
        fetchMeetings(); // REFRESH the list instantly after saving!
        
        setTimeout(() => {
          setIsModalOpen(false);
          setSelectedEmail("");
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Failed to send invite:", error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#f6f8fa] min-h-screen px-6 py-5 font-sans relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-gray-900">
            Video Consultations
          </h1>
          <p className="text-[13px] text-gray-500 mt-[2px] font-normal">
            Manage and conduct secure video consultations with clients
          </p>
        </div>

        {/* Added onClick to open modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#166534] text-white text-[13px] font-medium px-4 py-2 rounded-md hover:bg-[#14532d] transition-colors"
        >
          <Plus size={16} />
          Schedule Consultation
        </button>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* LEFT */}
        <div>
          {/* Upcoming */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="text-[14px] font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              Upcoming Consultations
            </h2>

            {/* DYNAMIC LIST MAPPING */}
            {upcomingMeetings.length === 0 ? (
              <p className="text-[13px] text-gray-500 text-center py-4">
                No upcoming consultations found.
              </p>
            ) : (
              upcomingMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  initials={meeting.clientName ? meeting.clientName.substring(0, 2).toUpperCase() : "CL"}
                  name={meeting.clientName}
                  caseName={meeting.caseName || "Legal Consultation"}
                  time="Pending Cal.com Booking"
                  duration="15 min"
                  joinUrl="https://cal.com/bookings" // Clickable Join link added here
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Quick Start */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-gray-900 mb-4">
              Quick Start
            </h3>

            {/* Added onClick to open modal */}
            <QuickBtn 
              icon={<Plus size={14} />} 
              text="Schedule New Consultation" 
              onClick={() => setIsModalOpen(true)}
            />
            <QuickBtn icon={<VideoIcon size={14} />} text="Start Instant Meeting" />
            <QuickBtn icon={<Link size={14} />} text="Share Meeting Link" />
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-gray-900 mb-4">
              Meeting Statistics
            </h3>

            <Stat label="This Week" value={upcomingMeetings.length} />
            <Stat label="This Month" value={upcomingMeetings.length} />
            <Stat label="Total Hours" value={((upcomingMeetings.length * 15) / 60).toFixed(1)} />
          </div>

          {/* Features */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-gray-900 mb-4">
              Features
            </h3>

            <ul className="space-y-3 text-[13px] text-gray-600">
              <li className="flex items-center gap-2">
                <VideoIcon size={14} /> HD Video Quality
              </li>
              <li className="flex items-center gap-2">
                <Copy size={14} /> Screen Sharing
              </li>
              <li className="flex items-center gap-2">
                <Link size={14} /> In-call Chat
              </li>
              <li className="flex items-center gap-2">
                <Copy size={14} /> Document Access
              </li>
              <li className="flex items-center gap-2">
                <VideoIcon size={14} /> Multi-participant
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- SCHEDULING MODAL UI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-900">Send Booking Link</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit}>
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-gray-700 mb-1">
                  Select Client
                </label>
                
                <select
                  required
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#166534] bg-white"
                >
                  <option value="" disabled>-- Choose a client --</option>
                  {users.map((user) => (
                    <option key={user._id || user.email} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {status === "error" && (
                <p className="text-red-600 text-[13px] mb-3">Failed to send link. Check server logs.</p>
              )}
              {status === "success" && (
                <p className="text-[#166534] text-[13px] mb-3">Cal.com link sent successfully!</p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={status === "loading"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success" || !selectedEmail}
                  className="px-4 py-2 text-[13px] font-medium text-white bg-[#166534] rounded-md hover:bg-[#14532d] disabled:opacity-70"
                >
                  {status === "loading" ? "Sending..." : "Send Cal.com Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

function MeetingCard({ initials, name, caseName, time, duration, joinUrl }) {
  return (
    <div className="flex items-center justify-between bg-[#f3f4f6] rounded-lg px-4 py-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#d1e7dd] flex items-center justify-center text-[12px] font-medium text-[#1b7f4c]">
          {initials}
        </div>

        <div>
          <p className="text-[14px] font-medium tracking-tight text-gray-900">
            {name}
          </p>
          <p className="text-[13px] text-gray-500">{caseName}</p>

          <div className="flex items-center gap-3 text-[12.5px] text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {time}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {duration}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-200 transition-colors">
          <Copy size={14} />
        </button>

        {/* Updated Join button to open the Cal.com bookings URL */}
        <button 
          onClick={() => window.open(joinUrl || "https://cal.com/bookings", "_blank")}
          className="bg-[#166534] text-white px-4 py-[6px] rounded-md text-[12.5px] font-medium hover:bg-[#14532d] transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
}

function QuickBtn({ icon, text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-2 border border-gray-200 rounded-md py-2 px-3 text-[13px] font-medium mb-3 hover:bg-gray-50 transition-colors"
    >
      {icon}
      {text}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between text-[16px] text-gray-600 mb-3">
      <span>{label}</span>
      <span className="text-gray-900 font-medium text-[15px]">{value}</span>
    </div>
  );
}