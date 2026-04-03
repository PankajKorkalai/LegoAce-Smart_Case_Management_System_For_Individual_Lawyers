// pages/Dashboard.jsx
import {
    Briefcase,
    Users,
    FileText,
    Clock
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
    Cell
  } from "recharts";
  
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
          <Card
            title="Active Cases"
            value="24"
            sub="+3 from last month"
            icon={<Briefcase />}
            color="bg-green-100 text-green-700"
          />
          <Card
            title="Total Clients"
            value="156"
            sub="+12 new clients"
            icon={<Users />}
            color="bg-blue-100 text-blue-600"
          />
          <Card
            title="Documents"
            value="1247"
            sub="89 pending review"
            icon={<FileText />}
            color="bg-yellow-100 text-yellow-600"
          />
          <Card
            title="Upcoming Hearings"
            value="8"
            sub="2 this week"
            icon={<Clock />}
            color="bg-red-100 text-red-600"
          />
        </div>
  
        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* AREA CHART */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Case Volume Trends</h2>
  
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
  
                <Area
                  type="monotone"
                  dataKey="pv"
                  stroke="#166534"
                  fill="#bbf7d0"
                />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#0f766e"
                  fill="#99f6e4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
  
          {/* PIE CHART */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">
              Case Status Distribution
            </h2>
  
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
  
            {/* LEGEND */}
            <div className="flex justify-center gap-4 mt-4 text-sm">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
  
        </div>
      </div>
    );
  }
  
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