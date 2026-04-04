import React from "react";
import {
  Calendar,
  Clock,
  Copy,
  Video as VideoIcon,
  Plus,
  Link,
} from "lucide-react";

export default function Video() {
  return (
    <div className="bg-[#f6f8fa] min-h-screen px-6 py-5 font-sans">
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

        <button className="flex items-center gap-2 bg-[#166534] text-white text-[13px] font-medium px-4 py-2 rounded-md">
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

            <MeetingCard
              initials="MR"
              name="Maria Rodriguez"
              caseName="Rodriguez Employment Claim"
              time="Feb 5, 2026 at 2:00 PM"
              duration="60 min"
            />

            <MeetingCard
              initials="JS"
              name="John Smith"
              caseName="Smith vs. Johnson Corp"
              time="Feb 8, 2026 at 10:00 AM"
              duration="45 min"
            />

            <MeetingCard
              initials="RD"
              name="Robert Davis"
              caseName="Davis Property Dispute"
              time="Feb 10, 2026 at 3:30 PM"
              duration="30 min"
            />
          </div>

          {/* Past */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-[14px] font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              Past Consultations
            </h2>

            <PastCard
              initials="TC"
              name="Tech Corp Inc"
              time="Feb 3, 2026 at 11:00 AM"
            />

            <PastCard
              initials="JW"
              name="James Wilson"
              time="Feb 1, 2026 at 4:00 PM"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Quick Start */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-gray-900 mb-4">
              Quick Start
            </h3>

            <QuickBtn icon={<Plus size={14} />} text="Schedule New Consultation" />
            <QuickBtn icon={<VideoIcon size={14} />} text="Start Instant Meeting" />
            <QuickBtn icon={<Link size={14} />} text="Share Meeting Link" />
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-gray-900 mb-4">
              Meeting Statistics
            </h3>

            <Stat label="This Week" value="4" />
            <Stat label="This Month" value="12" />
            <Stat label="Total Hours" value="18.5" />
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
    </div>
  );
}

/* COMPONENTS */

function MeetingCard({ initials, name, caseName, time, duration }) {
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
        <button className="border border-gray-300 rounded-md p-2">
          <Copy size={14} />
        </button>

        <button className="bg-[#166534] text-white px-4 py-[6px] rounded-md text-[12.5px] font-medium">
          Join
        </button>
      </div>
    </div>
  );
}

function PastCard({ initials, name, time }) {
  return (
    <div className="flex items-center justify-between bg-[#f3f4f6] rounded-lg px-4 py-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[12px] text-gray-600">
          {initials}
        </div>

        <div>
          <p className="text-[14px] font-medium tracking-tight text-gray-900">
            {name}
          </p>
          <p className="text-[12.5px] text-gray-500">{time}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] bg-gray-200 px-2 py-[3px] rounded">
          completed
        </span>

        <button className="text-[12.5px] text-gray-700 font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}

function QuickBtn({ icon, text }) {
  return (
    <button className="w-full flex items-center gap-2 border border-gray-200 rounded-md py-2 px-3 text-[13px] font-medium mb-3 hover:bg-gray-50">
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