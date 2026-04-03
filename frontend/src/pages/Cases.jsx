import { Search, Plus } from "lucide-react";
import CaseCard from "../components/CaseCard";

const cases = [
  {
    id: "CASE-2024-001",
    title: "Smith vs. Johnson Corp",
    status: "active",
    priority: "high",
    client: "John Smith",
    type: "Civil Litigation",
    docs: 45,
    nextHearing: "Feb 15, 2026",
    assigned: "Sarah Mitchell",
    risk: 78,
  },
  {
    id: "CASE-2024-002",
    title: "Davis Property Dispute",
    status: "pending",
    priority: "medium",
    client: "Robert Davis",
    type: "Real Estate",
    docs: 23,
    nextHearing: "Feb 20, 2026",
    assigned: "Michael Chen",
    risk: 45,
  },
];

export default function Cases() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cases</h1>
          <p className="text-gray-500">
            Manage and track all your legal cases
          </p>
        </div>

        <button className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
          <Plus size={16} /> New Case
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search cases by title, client, or ID..."
            className="outline-none w-full text-sm"
          />
        </div>

        <select className="px-3 py-2 rounded-lg bg-white shadow-sm text-sm">
          <option>All Status</option>
        </select>

        <select className="px-3 py-2 rounded-lg bg-white shadow-sm text-sm">
          <option>All Types</option>
        </select>
      </div>

      {/* Case List */}
      <div className="space-y-6">
        {cases.map((c, i) => (
          <CaseCard key={i} caseItem={c} />
        ))}
      </div>
    </div>
  );
}