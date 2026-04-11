// pages/Dashboard.jsx
import {
    Briefcase,
    Users,
    FileText,
    Clock,
    CalendarDays,
  } from "lucide-react";
  
  import { useState, useEffect } from "react";
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

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  /* ---------------- COMPONENT ---------------- */
  
  export default function Dashboard() {
    const [stats, setStats] = useState({
      metrics: { activeCases: 0, totalClients: 0, totalDocuments: 0, upcomingHearings: 0 },
      pieData: [],
      trendData: [],
      recentCases: [],
      upcomingEvents: []
    });
    const [loading, setLoading] = useState(true);

    const userName = localStorage.getItem("name") || "Lawyer";

    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${apiUrl}/api/dashboard/stats`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setStats(data);
          }
        } catch (error) {
          console.error("Dashboard fetch failed:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

    return (
      <div>
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Welcome back, {userName}. Here is your practice overview.
        </p>
  
        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <Card title="Active Cases" value={stats.metrics.activeCases} sub="Real-time" icon={<Briefcase />} color="bg-green-100 text-green-700" />
          <Card title="Total Clients" value={stats.metrics.totalClients} sub="Registered" icon={<Users />} color="bg-blue-100 text-blue-600" />
          <Card title="Documents" value={stats.metrics.totalDocuments} sub="In cases" icon={<FileText />} color="bg-yellow-100 text-yellow-600" />
          <Card title="Upcoming" value={stats.metrics.upcomingHearings} sub="Next 7 days" icon={<Clock />} color="bg-red-100 text-red-600" />
        </div>
  
        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Case Volume Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats.trendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" name="New Cases" dataKey="new" stroke="#166534" fill="#bbf7d0" />
                <Area type="monotone" name="Resolved" dataKey="resolved" stroke="#0f766e" fill="#99f6e4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
  
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Case Status Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.pieData} innerRadius={60} outerRadius={90} dataKey="value">
                  {stats.pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
  
            <div className="flex justify-center gap-4 mt-4 text-sm flex-wrap">
              {stats.pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* LOWER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
  
          {/* RECENT CASES */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm overflow-hidden">
            
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-[16px]">Recent Cases</h2>
              <button className="text-green-700 text-sm font-medium">
                View All →
              </button>
            </div>
  
            <div className="space-y-3">
              {stats.recentCases.length > 0 ? stats.recentCases.map((c, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#f8fafc] px-5 py-4 rounded-xl gap-4 sm:gap-0">
  
                  {/* LEFT */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-[14px]">{c.caseTitle}</p>
  
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
                      {c.client} &nbsp;&nbsp; {c.assignedTo}
                    </p>
                  </div>
  
                  {/* RIGHT */}
                  <div className="sm:text-right">
                    <p className="text-[12px] text-gray-500">
                      Next Hearing
                    </p>
                    <p className="text-[14px] font-medium">
                      {c.nextHearing ? new Date(c.nextHearing).toLocaleDateString() : "N/A"}
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
              )) : <p className="text-sm text-gray-400 text-center py-4">No recent cases found.</p>}
            </div>
          </div>
  
          {/* EVENTS */}
          <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm overflow-hidden">
            
            <h2 className="font-semibold text-[16px] mb-5">
              Upcoming Events
            </h2>
  
            <div className="space-y-3">
              {stats.upcomingEvents.length > 0 ? stats.upcomingEvents.map((e, i) => (
                <div key={i} className="flex gap-4 bg-[#f8fafc] px-5 py-4 rounded-xl">
                  
                  {/* ICON */}
                  <div className="bg-green-100 text-green-700 p-2 rounded-lg h-fit">
                    <CalendarDays size={16} />
                  </div>
  
                  {/* CONTENT */}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-1 gap-1 sm:gap-0">
                      <p className="text-[14px] font-medium truncate w-full">
                        {e.title}
                      </p>
  
                      {/* BADGE */}
                      <span
                        className="text-[11px] px-2 py-[2px] rounded-full font-medium whitespace-nowrap shrink-0 bg-blue-100 text-blue-600"
                      >
                        {e.tag}
                      </span>
                    </div>
  
                    <p className="text-[13px] text-gray-500">
                      {e.time}
                    </p>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-400 text-center py-4">No upcoming events.</p>}
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