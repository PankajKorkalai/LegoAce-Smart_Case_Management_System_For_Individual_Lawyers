import { useState } from "react";
import { Search, Plus, X, ChevronDown, Calendar, User, FileText, AlertCircle } from "lucide-react";

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
  },
  {
    id: "CASE-2024-003",
    title: "Rodriguez Employment Claim",
    status: "active",
    priority: "high",
    client: "Maria Rodriguez",
    type: "Employment Law",
    docs: 67,
    nextHearing: "Feb 25, 2026",
    assigned: "Sarah Mitchell",
  },
];

const clientsList = [
  "John Smith",
  "Maria Rodriguez",
  "Robert Davis",
  "James Wilson",
  "Tech Corp Inc",
  "Green Energy LLC",
];

const attorneys = [
  "Sarah Mitchell",
  "Michael Chen",
  "David Williams",
  "Lisa Anderson",
];

export default function Cases() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    caseTitle: "",
    client: "",
    priority: "medium",
    status: "active",
    assignedTo: "",
    caseDescription: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New case:", formData);
    setIsModalOpen(false);
    setFormData({
      caseTitle: "",
      client: "",
      priority: "medium",
      status: "active",
      assignedTo: "",
      caseDescription: "",
    });
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "bg-red-100 text-red-700";
    if (priority === "medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusColor = (status) => {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all your legal cases</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} /> New Case
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search cases, clients, documents..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 border border-gray-200 text-sm"
          />
        </div>

        <select className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Closed</option>
        </select>

        <select className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer">
          <option>All Types</option>
          <option>Civil Litigation</option>
          <option>Real Estate</option>
          <option>Employment Law</option>
          <option>Family Law</option>
        </select>
      </div>

      {/* Case Cards */}
      <div className="space-y-4">
        {cases.map((caseItem, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-semibold text-gray-900 text-lg">{caseItem.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{caseItem.id}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Client</p>
                      <p className="text-gray-900 font-medium text-sm">{caseItem.client}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Case Type</p>
                      <p className="text-gray-900 text-sm">{caseItem.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Documents</p>
                      <p className="text-gray-900 text-sm">{caseItem.docs} docs</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Next Hearing</p>
                      <p className="text-gray-900 text-sm">{caseItem.nextHearing}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Assigned to</p>
                  <p className="text-gray-900 font-medium text-sm">{caseItem.assigned}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Add New Case */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add New Case</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the case information to create a new record.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Case Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Case Title
                </label>
                <input
                  type="text"
                  name="caseTitle"
                  value={formData.caseTitle}
                  onChange={handleInputChange}
                  placeholder="Enter case title"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Client and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Client
                  </label>
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select client</option>
                    {clientsList.map((client, i) => (
                      <option key={i} value={client}>{client}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition appearance-none cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Status and Assigned To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select attorney</option>
                    {attorneys.map((attorney, i) => (
                      <option key={i} value={attorney}>{attorney}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Case Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Case Description
                </label>
                <textarea
                  name="caseDescription"
                  value={formData.caseDescription}
                  onChange={handleInputChange}
                  placeholder="Enter case details and notes"
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}