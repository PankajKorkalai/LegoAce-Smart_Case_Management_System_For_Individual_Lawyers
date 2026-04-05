import { useState, useRef, useEffect } from "react";
import { Search, Plus, X, MoreVertical, Eye, Bell, Edit, RefreshCw, Mail, Phone, MessageSquare, Send } from "lucide-react";

const initialCases = [
  {
    id: "CASE-2024-001",
    title: "Smith vs. Johnson Corp",
    status: "active",
    priority: "high",
    client: "John Smith",
    clientEmail: "john.smith@email.com",
    clientPhone: "+1 (555) 123-4567",
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
    clientEmail: "robert.davis@email.com",
    clientPhone: "+1 (555) 456-7890",
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
    clientEmail: "maria.rodriguez@email.com",
    clientPhone: "+1 (555) 234-5678",
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
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  
  const [formData, setFormData] = useState({
    caseTitle: "",
    client: "",
    priority: "medium",
    status: "active",
    assignedTo: "",
    caseDescription: "",
  });
  
  const [alertData, setAlertData] = useState({
    subject: "",
    message: "",
    platforms: {
      email: true,
      sms: false,
      whatsapp: false,
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAlertInputChange = (e) => {
    setAlertData({
      ...alertData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlatformToggle = (platform) => {
    setAlertData({
      ...alertData,
      platforms: {
        ...alertData.platforms,
        [platform]: !alertData.platforms[platform],
      },
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

  const handleSendAlert = (e) => {
    e.preventDefault();
    console.log("Sending alert for case:", selectedCase);
    console.log("Alert data:", alertData);
    alert(`Alert sent to ${selectedCase.client} via ${Object.keys(alertData.platforms).filter(p => alertData.platforms[p]).join(', ')}`);
    setIsAlertModalOpen(false);
    setAlertData({
      subject: "",
      message: "",
      platforms: {
        email: true,
        sms: false,
        whatsapp: false,
      },
    });
    setSelectedCase(null);
  };

  const openAlertModal = (caseItem) => {
    console.log("Opening alert modal for:", caseItem.title);
    setSelectedCase(caseItem);
    setAlertData({
      subject: `Update regarding ${caseItem.title}`,
      message: `Dear ${caseItem.client},\n\nThis is an update regarding your case ${caseItem.title} (${caseItem.id}).\n\nNext hearing: ${caseItem.nextHearing}\n\nPlease contact our office if you have any questions.\n\nBest regards,\nLegalFlow Team`,
      platforms: {
        email: true,
        sms: false,
        whatsapp: false,
      },
    });
    setIsAlertModalOpen(true);
    setOpenMenuId(null);
  };

  const handleViewDetails = (caseItem) => {
    console.log("View details for:", caseItem);
    setOpenMenuId(null);
  };

  const handleEditCase = (caseItem) => {
    console.log("Edit case:", caseItem);
    setOpenMenuId(null);
  };

  const handleChangeStatus = (caseItem) => {
    console.log("Change status for:", caseItem);
    setOpenMenuId(null);
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
        {initialCases.map((caseItem, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
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
                  <p className="text-sm text-gray-500 mb-3">{caseItem.id}</p>
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

                {/* Three Dots Button */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === caseItem.id ? null : caseItem.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === caseItem.id && (
                    <div 
                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleViewDetails(caseItem)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      <button
                        onClick={() => openAlertModal(caseItem)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <Bell size={14} /> Send Alerts
                      </button>
                      <button
                        onClick={() => handleEditCase(caseItem)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <Edit size={14} /> Edit Case
                      </button>
                      <button
                        onClick={() => handleChangeStatus(caseItem)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <RefreshCw size={14} /> Change Status
                      </button>
                    </div>
                  )}
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
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add New Case</h2>
                  <p className="text-sm text-gray-500 mt-1">Enter the case information to create a new record.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                  <X size={22} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Case Title</label>
                <input type="text" name="caseTitle" value={formData.caseTitle} onChange={handleInputChange} placeholder="Enter case title" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
                  <select name="client" value={formData.client} onChange={handleInputChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required>
                    <option value="">Select client</option>
                    {clientsList.map((client, i) => (<option key={i} value={client}>{client}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned To</label>
                  <select name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required>
                    <option value="">Select attorney</option>
                    {attorneys.map((attorney, i) => (<option key={i} value={attorney}>{attorney}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Case Description</label>
                <textarea name="caseDescription" value={formData.caseDescription} onChange={handleInputChange} placeholder="Enter case details and notes" rows={4} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium">Create Case</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Send Alerts */}
      {isAlertModalOpen && selectedCase && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4"
          onClick={(e) => {
            // Don't close when clicking inside the modal
            if (e.target === e.currentTarget) {
              // Optional: close when clicking backdrop
              // setIsAlertModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send Alert to Client</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Send notification to {selectedCase.client} regarding {selectedCase.title}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsAlertModalOpen(false);
                    setSelectedCase(null);
                  }} 
                  className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSendAlert} className="px-6 py-5 space-y-5">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-1">Case Information</p>
                <p className="text-sm text-blue-700">{selectedCase.title} ({selectedCase.id})</p>
                <p className="text-sm text-blue-600 mt-1">Client: {selectedCase.client}</p>
                <p className="text-sm text-blue-600">Next Hearing: {selectedCase.nextHearing}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="subject" 
                  value={alertData.subject} 
                  onChange={handleAlertInputChange} 
                  placeholder="Enter alert subject" 
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea 
                  name="message" 
                  value={alertData.message} 
                  onChange={handleAlertInputChange} 
                  placeholder="Enter your message to the client..." 
                  rows={6} 
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Send via</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <input type="checkbox" checked={alertData.platforms.email} onChange={() => handlePlatformToggle("email")} className="w-4 h-4 text-green-600" />
                    <Mail size={18} className="text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-xs text-gray-400">Send to {selectedCase.clientEmail}</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <input type="checkbox" checked={alertData.platforms.sms} onChange={() => handlePlatformToggle("sms")} className="w-4 h-4 text-green-600" />
                    <Phone size={18} className="text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">SMS / Text Message</p>
                      <p className="text-xs text-gray-400">Send to {selectedCase.clientPhone}</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <input type="checkbox" checked={alertData.platforms.whatsapp} onChange={() => handlePlatformToggle("whatsapp")} className="w-4 h-4 text-green-600" />
                    <MessageSquare size={18} className="text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">WhatsApp</p>
                      <p className="text-xs text-gray-400">Send to {selectedCase.clientPhone}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Templates</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button" 
                    onClick={() => setAlertData({...alertData, message: `Dear ${selectedCase.client},\n\nThis is a reminder that your next hearing for ${selectedCase.title} is scheduled on ${selectedCase.nextHearing}.\n\nPlease ensure all required documents are submitted before the hearing date.\n\nBest regards,\nLegalFlow Team`})} 
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Hearing Reminder
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAlertData({...alertData, message: `Dear ${selectedCase.client},\n\nWe have received new documents related to your case ${selectedCase.title}. Please review them at your earliest convenience.\n\nBest regards,\nLegalFlow Team`})} 
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Document Update
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAlertData({...alertData, message: `Dear ${selectedCase.client},\n\nWe would like to schedule a follow-up consultation regarding ${selectedCase.title}. Please let us know your availability.\n\nThank you for your cooperation.\n\nBest regards,\nLegalFlow Team`})} 
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAlertModalOpen(false);
                    setSelectedCase(null);
                  }} 
                  className="px-5 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium flex items-center gap-2"
                >
                  <Send size={14} /> Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}