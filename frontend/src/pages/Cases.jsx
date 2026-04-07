import { useState, useRef, useEffect } from "react";
import { Search, Plus, X, MoreVertical, Eye, Bell, Edit, RefreshCw, Mail, Phone, Send, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
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
  const [cases, setCases] = useState(initialCases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [formData, setFormData] = useState({
    caseTitle: "",
    client: "",
    priority: "medium",
    status: "active",
    assignedTo: "",
    caseDescription: "",
  });
  
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSubject, setAlertSubject] = useState("");
  const [sendVia, setSendVia] = useState({
    email: true,
    sms: false,
    whatsapp: false,
  });

  // Fetch cases from backend
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_API_URL}/user/getcases`);
        if (resp.data && resp.data.cases) {
          const fetchedCases = resp.data.cases.map((c) => ({
            id: c._id || `CASE-${Math.random().toString(36).substr(2, 5)}`,
            title: c.caseTitle,
            status: c.status || 'active',
            priority: c.priority || 'medium',
            client: c.client,
            clientEmail: c.clientEmail || "",
            clientPhone: "+1 (555) 000-0000",
            type: "General",
            docs: c.documentsCount || 0,
            nextHearing: c.nextHearing || "TBD",
            assigned: c.assignedTo || "Unassigned"
          }));
          setCases(fetchedCases);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };
    fetchCases();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const casePayload = {
        caseTitle: formData.caseTitle,
        client: formData.client,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo,
        caseDescription: formData.caseDescription,
        clientEmail: formData.clientEmail || "client@email.com",
      };

      let resp;
      if (editingCaseId) {
        resp = await axios.put(`${import.meta.env.VITE_API_URL}/user/updatecase/${editingCaseId}`, casePayload);
      } else {
        resp = await axios.post(`${import.meta.env.VITE_API_URL}/user/addcase`, casePayload);
      }
      
      if (resp.data && resp.data.case) {
        const c = resp.data.case;
        const mappedCase = {
          id: c._id,
          title: c.caseTitle,
          status: c.status || 'active',
          priority: c.priority || 'medium',
          client: c.client,
          clientEmail: c.clientEmail,
          clientPhone: "+1 (555) 000-0000",
          type: "General",
          docs: c.documentsCount || 0,
          nextHearing: c.nextHearing || "TBD",
          assigned: c.assignedTo || "Unassigned"
        };
        
        if (editingCaseId) {
          setCases(cases.map(existing => existing.id === editingCaseId ? mappedCase : existing));
        } else {
          setCases([mappedCase, ...cases]);
        }

        if (c.status === "closed") {
          console.log("=== FEEDBACK EMAIL DISPATCHED ===");
          console.log("Backend response: Case closed securely!");
        }
      }
      setIsModalOpen(false);
      setEditingCaseId(null);
      setFormData({
        caseTitle: "",
        client: "",
        priority: "medium",
        status: "active",
        assignedTo: "",
        caseDescription: "",
      });
    } catch (err) {
      console.error("Error adding case:", err);
      alert("Failed to create case.");
    }
  };

  const handleToggleMenu = (caseId, event) => {
    event.stopPropagation();
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      right: window.innerWidth - rect.right + 10,
    });
    setOpenMenuId(openMenuId === caseId ? null : caseId);
  };

  const openAlertDialog = (caseItem) => {
    setSelectedCase(caseItem);
    setAlertSubject(`Update regarding ${caseItem.title}`);
    setAlertMessage(`Dear ${caseItem.client},

This is an update regarding your case ${caseItem.title} (${caseItem.id}).

Next hearing: ${caseItem.nextHearing}

Please contact our office if you have any questions.

Best regards,
LegalFlow Team`);
    setSendVia({ email: true, sms: false, whatsapp: false });
    setShowAlertDialog(true);
    setOpenMenuId(null);
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    const selectedMethods = Object.keys(sendVia).filter(key => sendVia[key]);
    
    if (selectedMethods.length === 0) {
      alert("Please select at least one method (Email, SMS, or WhatsApp)");
      return;
    }
    
    try {
      if (sendVia.email) {
        const resp = await axios.post(`${import.meta.env.VITE_API_URL}/user/sendalert`, {
          email: selectedCase.clientEmail,
          subject: alertSubject,
          message: alertMessage
        });
        console.log("=== ALERT EMAIL DISPATCHED ===");
        console.log("Backend response:", resp.data.message);
      }

      // Store sent alert in case object (for demo)
      const updatedCases = cases.map(c => 
        c.id === selectedCase.id 
          ? { ...c, lastAlert: { message: alertSubject, date: new Date().toISOString(), methods: selectedMethods } }
          : c
      );
      setCases(updatedCases);
      
      setShowAlertDialog(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setSelectedCase(null);
      setAlertMessage("");
      setAlertSubject("");
    } catch (error) {
      console.error("Error sending alert:", error);
      alert("Failed to send alert via email. Check console for details.");
    }
  };

  const handleViewDetails = (caseItem) => {
    console.log("View details:", caseItem);
    setOpenMenuId(null);
    // You can implement a details modal here
    alert(`Case Details:\n\nTitle: ${caseItem.title}\nClient: ${caseItem.client}\nStatus: ${caseItem.status}\nPriority: ${caseItem.priority}\nNext Hearing: ${caseItem.nextHearing}`);
  };

  const handleEditCase = (caseItem) => {
    console.log("Edit case:", caseItem);
    setOpenMenuId(null);
    setEditingCaseId(caseItem.id);
    // Pre-fill form for editing
    setFormData({
      caseTitle: caseItem.title,
      client: caseItem.client,
      priority: caseItem.priority,
      status: caseItem.status,
      assignedTo: caseItem.assigned,
      caseDescription: "",
    });
    setIsModalOpen(true);
  };

  const handleChangeStatus = async (caseItem, newStatus) => {
    try {
      const resp = await axios.put(`${import.meta.env.VITE_API_URL}/user/updatestatus/${caseItem.id}`, { status: newStatus });
      const updatedCases = cases.map(c => 
        c.id === caseItem.id ? { ...c, status: newStatus } : c
      );
      setCases(updatedCases);
      setOpenMenuId(null);
      if (newStatus === "closed") {
        console.log("=== FEEDBACK EMAIL DISPATCHED ===");
        console.log("Backend response:", resp.data.message);
        alert("Case closed successfully! A feedback request has been emailed to the client.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
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

  // Filter cases based on search and filters
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || 
                         caseItem.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesType = typeFilter === "All Types" || 
                       caseItem.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get unique case types for filter
  const caseTypes = ["All Types", ...new Set(cases.map(c => c.type))];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <CheckCircle size={20} />
          Alert sent successfully!
        </div>
      )}

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Closed</option>
        </select>

        <select 
          className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {caseTypes.map((type, idx) => (
            <option key={idx}>{type}</option>
          ))}
        </select>
      </div>

      {/* Case Cards */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No cases found matching your criteria.
          </div>
        ) : (
          filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="font-semibold text-gray-900 text-lg">{caseItem.title}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                      {caseItem.lastAlert && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                          Alert Sent
                        </span>
                      )}
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
                  <div>
                    <button
                      onClick={(e) => handleToggleMenu(caseItem.id, e)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <MoreVertical size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Global Dropdown Menu */}
      {openMenuId && (
        <div 
          className="fixed z-50 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
          }}
        >
          {(() => {
            const caseItem = cases.find(c => c.id === openMenuId);
            if (!caseItem) return null;
            return (
              <div className="py-1">
                <button
                  onClick={() => handleViewDetails(caseItem)}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                >
                  <Eye size={14} /> View Details
                </button>
                <button
                  onClick={() => openAlertDialog(caseItem)}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                >
                  <Bell size={14} /> Send Alerts
                </button>
                <button
                  onClick={() => handleEditCase(caseItem)}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                >
                  <Edit size={14} /> Edit Case
                </button>
                
                {/* Change Status Submenu */}
                <div className="relative group">
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                  >
                    <RefreshCw size={14} /> Change Status
                  </button>
                  <div className="absolute left-full top-0 ml-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={() => handleChangeStatus(caseItem, "active")}
                      className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-gray-50"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => handleChangeStatus(caseItem, "pending")}
                      className="w-full px-4 py-2 text-left text-sm text-yellow-700 hover:bg-gray-50"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleChangeStatus(caseItem, "closed")}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Closed
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Modal - Add New Case */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{editingCaseId ? "Edit Case" : "Add New Case"}</h2>
                  <p className="text-sm text-gray-500 mt-1">Enter the case information to create a new record.</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setEditingCaseId(null); }} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                  <X size={22} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Case Title</label>
                <input type="text" name="caseTitle" value={formData.caseTitle} onChange={handleInputChange} placeholder="Enter case title" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Email</label>
                <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleInputChange} placeholder="Enter client email" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required />
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
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingCaseId(null); }} className="px-5 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium">{editingCaseId ? "Save Changes" : "Create Case"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALERT DIALOG BOX */}
      {showAlertDialog && selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-xl w-[550px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    Send Alert to Client
                  </h2>
                </div>
                <button 
                  onClick={() => setShowAlertDialog(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-900">{selectedCase.title}</p>
                <p className="text-sm text-gray-600 mt-1">Client: {selectedCase.client}</p>
                <p className="text-sm text-gray-600">Case ID: {selectedCase.id}</p>
                <p className="text-sm text-gray-600">Next Hearing: {selectedCase.nextHearing}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={alertSubject}
                    onChange={(e) => setAlertSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Enter subject"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                    placeholder="Enter your message"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Send via *</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={sendVia.email}
                        onChange={(e) => setSendVia({...sendVia, email: e.target.checked})}
                        className="w-4 h-4 text-green-600"
                      />
                      <Mail size={18} className="text-gray-500" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Email</span>
                        <p className="text-xs text-gray-500">{selectedCase.clientEmail}</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={sendVia.sms}
                        onChange={(e) => setSendVia({...sendVia, sms: e.target.checked})}
                        className="w-4 h-4 text-green-600"
                      />
                      <Phone size={18} className="text-gray-500" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">SMS</span>
                        <p className="text-xs text-gray-500">{selectedCase.clientPhone}</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={sendVia.whatsapp}
                        onChange={(e) => setSendVia({...sendVia, whatsapp: e.target.checked})}
                        className="w-4 h-4 text-green-600"
                      />
                      <Send size={18} className="text-gray-500" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">WhatsApp</span>
                        <p className="text-xs text-gray-500">{selectedCase.clientPhone}</p>
                      </div>
                    </label>

                          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                      
                        className="w-4 h-4 text-green-600"
                      />
                      <Phone size={18} className="text-gray-500" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Call</span>
                        <p className="text-xs text-gray-500">{selectedCase.clientPhone}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAlertDialog(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendAlert}
                    className="flex-1 px-4 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Send Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation CSS */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}