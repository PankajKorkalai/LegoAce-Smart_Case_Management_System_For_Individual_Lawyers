// pages/Dashboard.jsx
export default function Dashboard() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Welcome back, Sarah. Here is your practice overview.
        </p>
  
        {/* Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Active Cases" value="24" sub="+3 from last month" />
          <StatCard title="Total Clients" value="156" sub="+12 new clients" />
          <StatCard title="Documents" value="1247" sub="89 pending review" />
          <StatCard title="Upcoming Hearings" value="8" sub="2 this week" />
        </div>
  
        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Left Chart */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Case Volume Trends</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              Chart Here
            </div>
          </div>
  
          {/* Right Chart */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Case Status Distribution</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              Pie Chart Here
            </div>
          </div>
  
        </div>
      </div>
    );
  }
  
  function StatCard({ title, value, sub }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-green-600 text-sm">{sub}</p>
      </div>
    );
  }