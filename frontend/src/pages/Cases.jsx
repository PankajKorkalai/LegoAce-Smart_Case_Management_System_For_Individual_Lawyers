import { useState, useRef, useEffect } from "react";
import { Search, Plus, X, MoreVertical, Eye, Bell, Edit, RefreshCw, Mail, Phone, Send, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
const attorneys = [
  "Adv. Pankaj Korkalai",
  "Adv. Sarah Mitchell",
  "Adv. Michael Chen",
  "Adv. David Williams",
  "Adv. Lisa Anderson",
];

export default function Cases() {
  const [cases, setCases] = useState([]);
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
  const [dbClients, setDbClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const [formData, setFormData] = useState({
    caseTitle: "",
    client: "",
    priority: "medium",
    status: "active",
    assignedTo: "",
    caseDescription: "",
    clientEmail: "",
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

    const fetchClients = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_API_URL}/user/getclients`);
        if (resp.data && resp.data.clients) {
          setDbClients(resp.data.clients);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-fill email when a client is selected from the dropdown
    if (name === "client" && value) {
      const selectedClient = dbClients.find(c => c.name === value);
      if (selectedClient) {
        updatedData.clientEmail = selectedClient.email;
      }
    }

    setFormData(updatedData);
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
        userId: localStorage.getItem("userId"), // PASS LOGGED IN USER ID
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
      clientEmail: caseItem.clientEmail || "",
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

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/user/deletecase/${caseId}`);
      setCases(cases.filter(c => c.id !== caseId));
      setOpenMenuId(null);
      alert("Case deleted successfully.");
    } catch (err) {
      console.error("Failed to delete case:", err);
      alert("Failed to delete case. Please try again.");
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
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <CheckCircle size={20} />
          Alert sent successfully!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search cases, clients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 border border-gray-200 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Closed</option>
          </select>

          <select 
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {caseTypes.map((type, idx) => (
              <option key={idx}>{type}</option>
            ))}
          </select>
        </div>
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
                    <p className="text-sm text-gray-500 mb-4">{caseItem.id}</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Client</p>
                        <p className="text-gray-900 font-semibold">{caseItem.client}</p>
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
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Next Hearing</p>
                        <p className="text-gray-900 font-semibold">{caseItem.nextHearing}</p>
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
          ref={menuRef}
          className="fixed z-50 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg animate-in fade-in zoom-in duration-200"
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
                <button
                  onClick={() => handleDeleteCase(caseItem.id)}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <X size={14} /> Delete Case
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-2">
            <div className="px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
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
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    autoComplete="off"
                    placeholder="Search client name..."
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInputChange(e);
                      setShowClientDropdown(true);
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    required
                  />
                  {showClientDropdown && formData.client && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {dbClients
                        .filter(c => c.name.toLowerCase().includes(formData.client.toLowerCase()))
                        .map((client, i) => (
                          <div
                            key={i}
                            className="px-4 py-2 text-sm hover:bg-green-50 cursor-pointer border-b last:border-0 border-gray-100"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                client: client.name,
                                clientEmail: client.email
                              });
                              setShowClientDropdown(false);
                            }}
                          >
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        ))}
                      {dbClients.filter(c => c.name.toLowerCase().includes(formData.client.toLowerCase())).length === 0 && (
                        <div className="px-4 py-3 text-xs text-gray-500 italic">No matching clients found</div>
                      )}
                    </div>
                  )}
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

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingCaseId(null); }} className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium shadow-md">{editingCaseId ? "Save Changes" : "Create Case"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALERT DIALOG BOX */}
      {showAlertDialog && selectedCase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl w-[550px] max-w-full max-h-[90vh] overflow-y-auto m-2">
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

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowAlertDialog(false)}
                    className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendAlert}
                    className="w-full sm:flex-1 px-4 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium flex items-center justify-center gap-2 text-sm shadow-md"
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