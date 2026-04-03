import { Calendar, FileText, MoreVertical, AlertTriangle } from "lucide-react";

export default function CaseCard({ caseItem }) {
  
  // 🎯 Risk color logic
  const getRiskColor = (risk) => {
    if (risk >= 70) return "text-red-600";
    if (risk >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskBg = (risk) => {
    if (risk >= 70) return "bg-red-100";
    if (risk >= 40) return "bg-yellow-100";
    return "bg-green-100";
  };

  // Status + Priority colors
  const statusColor =
    caseItem.status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  const priorityColor =
    caseItem.priority === "high"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
      
      <div className="flex justify-between">
        
        {/* LEFT SIDE */}
        <div className="space-y-3">
          
          {/* Title */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {caseItem.title}
            </h2>

            <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
              {caseItem.status}
            </span>

            <span className={`text-xs px-2 py-1 rounded ${priorityColor}`}>
              {caseItem.priority}
            </span>
          </div>

          {/* Meta */}
          <div className="text-sm text-gray-600 flex gap-6 flex-wrap">
            <span>{caseItem.id}</span>
            <span>👤 {caseItem.client}</span>
            <span>{caseItem.type}</span>
            <span className="flex items-center gap-1">
              <FileText size={14} /> {caseItem.docs} docs
            </span>
          </div>

          {/* Bottom */}
          <div className="text-sm text-gray-600 flex gap-6 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Next Hearing: <b>{caseItem.nextHearing}</b>
            </span>

            <span>
              Assigned: <b>{caseItem.assigned}</b>
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end justify-between">
          
          {/* AI Risk Label */}
          <div className={`flex items-center gap-2 text-sm ${getRiskColor(caseItem.risk)}`}>
            <AlertTriangle size={14} />
            AI Risk
          </div>

          {/* Risk Percentage */}
          <div
            className={`text-2xl font-bold px-3 py-1 rounded-lg ${getRiskBg(
              caseItem.risk
            )} ${getRiskColor(caseItem.risk)}`}
          >
            {caseItem.risk}%
          </div>

          {/* Menu */}
          <MoreVertical className="cursor-pointer text-gray-500" />
        </div>
      </div>
    </div>
  );
}