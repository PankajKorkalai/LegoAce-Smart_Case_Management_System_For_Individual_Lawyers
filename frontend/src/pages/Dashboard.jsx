// pages/Dashboard.jsx
import {
    Briefcase,
    Users,
    FileText,
    Clock,
    CalendarDays,
  } from "lucide-react";
  
  import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
  } from "recharts";
  
  /* ---------------- DATA ---------------- */
  
  const data = [
    { name: "Jan", uv: 10, pv: 15 },
    { name: "Feb", uv: 15, pv: 18 },
    { name: "Mar", uv: 13, pv: 16 },
    { name: "Apr", uv: 18, pv: 22 },
    { name: "May", uv: 14, pv: 18 },
    { name: "Jun", uv: 20, pv: 25 },
    { name: "Jul", uv: 22, pv: 27 },
    { name: "Aug", uv: 19, pv: 23 },
    { name: "Sep", uv: 25, pv: 29 },
    { name: "Oct", uv: 23, pv: 27 },
    { name: "Nov", uv: 28, pv: 32 },
    { name: "Dec", uv: 30, pv: 36 },
  ];
  
  const pieData = [
    { name: "Active", value: 30, color: "#166534" },
    { name: "Closed", value: 45, color: "#0f766e" },
    { name: "On Hold", value: 10, color: "#b91c1c" },
    { name: "Pending", value: 15, color: "#a16207" },
  ];
  
  const cases = [
    {
      title: "Smith vs. Johnson Corp",
      caseNo: "CASE-2024-001",
      type: "Civil Litigation",
      priority: "high",
      date: "Feb 15, 2026",
      status: "active",
    },
    {
      title: "Davis Property Dispute",
      caseNo: "CASE-2024-002",
      type: "Real Estate",
      priority: "medium",
      date: "Feb 20, 2026",
      status: "pending",
    },
    {
      title: "Rodriguez Employment Claim",
      caseNo: "CASE-2024-003",
      type: "Employment Law",
      priority: "high",
      date: "Feb 12, 2026",
      status: "active",
    },
    {
      title: "Wilson Divorce Settlement",
      caseNo: "CASE-2024-004",
      type: "Family Law",
      priority: "low",
      date: "Feb 25, 2026",
      status: "active",
    },
    {
      title: "Tech Corp Patent Infringement",
      caseNo: "CASE-2024-005",
      type: "Intellectual Property",
      priority: "medium",
      date: "Mar 5, 2026",
      status: "on-hold",
    },
  ];
  
  const events = [
    {
      title: "Court Hearing - Smith vs. Johnson",
      time: "Feb 5, 2026 at 9:00 AM • Court Room 4",
      tag: "hearing",
    },
    {
      title: "Client Meeting - Maria Rodriguez",
      time: "Feb 5, 2026 at 2:00 PM • Video Call",
      tag: "meeting",
    },
    {
      title: "Deposition - Davis Case",
      time: "Feb 6, 2026 at 10:30 AM • Conference Room A",
      tag: "deposition",
    },
    {
      title: "Contract Review Deadline",
      time: "Feb 7, 2026 at 5:00 PM",
      tag: "deadline",
    },
  ];
  
  /* ---------------- COMPONENT ---------------- */
  
  export default function Dashboard() {
    return (
      <div>
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Welcome back, Sarah. Here is your practice overview.
        </p>
  
        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card title="Active Cases" value="24" sub="+3 from last month" icon={<Briefcase />} color="bg-green-100 text-green-700" />
          <Card title="Total Clients" value="156" sub="+12 new clients" icon={<Users />} color="bg-blue-100 text-blue-600" />
          <Card title="Documents" value="1247" sub="89 pending review" icon={<FileText />} color="bg-yellow-100 text-yellow-600" />
          <Card title="Upcoming Hearings" value="8" sub="2 this week" icon={<Clock />} color="bg-red-100 text-red-600" />
        </div>
  
        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-6">
          
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Case Volume Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="pv" stroke="#166534" fill="#bbf7d0" />
                <Area type="monotone" dataKey="uv" stroke="#0f766e" fill="#99f6e4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
  
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Case Status Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={90} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
  
            <div className="flex justify-center gap-4 mt-4 text-sm">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* LOWER SECTION */}
        <div className="grid grid-cols-3 gap-6 mt-6">
  
          {/* RECENT CASES */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-[16px]">Recent Cases</h2>
              <button className="text-green-700 text-sm font-medium">
                View All →
              </button>
            </div>
  
            <div className="space-y-3">
              {cases.map((c, i) => (
                <div key={i} className="flex justify-between items-center bg-[#f8fafc] px-5 py-4 rounded-xl">
  
                  {/* LEFT */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[14px]">{c.title}</p>
  
                      {/* BADGE */}
                      <span
                        className={`text-[11px] px-2 py-[2px] rounded-full font-medium ${
                          c.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : c.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {c.priority}
                      </span>
                    </div>
  
                    <p className="text-[13px] text-gray-500">
                      {c.caseNo} &nbsp;&nbsp; {c.type}
                    </p>
                  </div>
  
                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="text-[12px] text-gray-500">
                      Next Hearing
                    </p>
                    <p className="text-[14px] font-medium">
                      {c.date}
                    </p>
  
                    {/* STATUS */}
                    <span
                      className={`text-[11px] px-2 py-[2px] rounded-full font-medium inline-block mt-1 ${
                        c.status === "active"
                          ? "bg-green-100 text-green-700"
                          : c.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* EVENTS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            
            <h2 className="font-semibold text-[16px] mb-5">
              Upcoming Events
            </h2>
  
            <div className="space-y-3">
              {events.map((e, i) => (
                <div key={i} className="flex gap-4 bg-[#f8fafc] px-5 py-4 rounded-xl">
                  
                  {/* ICON */}
                  <div className="bg-green-100 text-green-700 p-2 rounded-lg h-fit">
                    <CalendarDays size={16} />
                  </div>
  
                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[14px] font-medium">
                        {e.title}
                      </p>
  
                      {/* BADGE */}
                      <span
                        className={`text-[11px] px-2 py-[2px] rounded-full font-medium ${
                          e.tag === "hearing"
                            ? "bg-red-100 text-red-600"
                            : e.tag === "meeting"
                            ? "bg-blue-100 text-blue-600"
                            : e.tag === "deposition"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {e.tag}
                      </span>
                    </div>
  
                    <p className="text-[13px] text-gray-500">
                      {e.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
        </div>
      </div>
    );
  }
  
  /* ---------------- CARD ---------------- */
  
  function Card({ title, value, sub, icon, color }) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
          <p className="text-green-600 text-sm">{sub}</p>
        </div>
  
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    );
  }