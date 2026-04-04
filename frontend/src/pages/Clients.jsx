import { useState, useEffect } from "react";
import {
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Building,
  X,
  Search,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Briefcase,
  FileText,
  Clock,
  User,
  Star,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  Upload,
  Link,
  ExternalLink,
  CreditCard,
  Activity,
  Users,
  ChevronRight,
} from "lucide-react";

/* -------------------- CLIENT DATA -------------------- */

const initialClients = [
  {
    id: "clt_1",
    name: "John Smith",
    initials: "JS",
    type: "individual",
    status: "active",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    company: "Smith Enterprises",
    address: "123 Main St, Los Angeles, CA 90001",
    notes: "Preferred client, always pays on time",
    activeCases: 2,
    totalCases: 5,
    lastContact: "2026-02-01",
    createdAt: "2024-06-15",
    rating: 4.8,
    cases: [
      { id: "case_1", name: "Smith vs. Johnson Corp", type: "Civil Litigation", status: "active", date: "2025-01-10" },
      { id: "case_2", name: "Property Dispute", type: "Real Estate", status: "active", date: "2025-08-20" },
    ],
    documents: [
      { id: "doc_1", name: "Retainer Agreement.pdf", date: "2024-06-15", size: "2.3 MB" },
      { id: "doc_2", name: "Evidence Package.pdf", date: "2025-02-10", size: "5.1 MB" },
    ],
    activities: [
      { id: "act_1", type: "meeting", description: "Case strategy meeting", date: "2026-01-28" },
      { id: "act_2", type: "call", description: "Phone consultation", date: "2026-02-01" },
    ],
  },
  {
    id: "clt_2",
    name: "Maria Rodriguez",
    initials: "MR",
    type: "individual",
    status: "active",
    email: "maria.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    company: "",
    address: "456 Oak Ave, San Francisco, CA 94102",
    notes: "Employment law client, very responsive",
    activeCases: 1,
    totalCases: 1,
    lastContact: "2026-01-28",
    createdAt: "2025-09-10",
    rating: 5.0,
    cases: [
      { id: "case_3", name: "Rodriguez Employment Claim", type: "Employment", status: "active", date: "2025-09-15" },
    ],
    documents: [
      { id: "doc_3", name: "Employment Contract.pdf", date: "2025-09-20", size: "1.2 MB" },
    ],
    activities: [
      { id: "act_3", type: "email", description: "Sent case update", date: "2026-01-25" },
    ],
  },
  {
    id: "clt_3",
    name: "Tech Corp Inc",
    initials: "TC",
    type: "corporate",
    status: "active",
    email: "legal@techcorp.com",
    phone: "+1 (555) 345-6789",
    company: "Tech Corp Inc",
    address: "789 Silicon Way, San Jose, CA 95110",
    notes: "Corporate client, multiple IP cases",
    activeCases: 1,
    totalCases: 3,
    lastContact: "2026-01-25",
    createdAt: "2024-03-10",
    rating: 4.5,
    cases: [
      { id: "case_4", name: "Patent Infringement", type: "IP Law", status: "active", date: "2025-05-10" },
      { id: "case_5", name: "Trademark Registration", type: "IP Law", status: "closed", date: "2024-08-01" },
    ],
    documents: [
      { id: "doc_4", name: "Patent Application.pdf", date: "2025-06-01", size: "3.4 MB" },
      { id: "doc_5", name: "NDA Agreement.pdf", date: "2024-03-15", size: "0.8 MB" },
    ],
    activities: [
      { id: "act_4", type: "meeting", description: "IP strategy review", date: "2026-01-20" },
    ],
  },
  {
    id: "clt_4",
    name: "Robert Davis",
    initials: "RD",
    type: "corporate",
    status: "active",
    email: "robert.davis@email.com",
    phone: "+1 (555) 456-7890",
    company: "Davis Holdings",
    address: "321 Market St, New York, NY 10001",
    notes: "High net worth individual",
    activeCases: 3,
    totalCases: 6,
    lastContact: "2026-02-03",
    createdAt: "2023-11-20",
    rating: 4.9,
    cases: [
      { id: "case_6", name: "Merger Acquisition", type: "Corporate", status: "active", date: "2025-10-01" },
      { id: "case_7", name: "Contract Dispute", type: "Commercial", status: "active", date: "2025-12-05" },
    ],
    documents: [
      { id: "doc_6", name: "Financial Statements.pdf", date: "2025-11-01", size: "4.2 MB" },
    ],
    activities: [
      { id: "act_5", type: "call", description: "Weekly status update", date: "2026-02-03" },
    ],
  },
  {
    id: "clt_5",
    name: "James Wilson",
    initials: "JW",
    type: "individual",
    status: "inactive",
    email: "james.wilson@email.com",
    phone: "+1 (555) 567-8901",
    company: "",
    address: "987 Pine St, Seattle, WA 98101",
    notes: "Case closed, potential future work",
    activeCases: 0,
    totalCases: 4,
    lastContact: "2026-01-30",
    createdAt: "2024-08-05",
    rating: 4.2,
    cases: [
      { id: "case_8", name: "Personal Injury", type: "Tort", status: "closed", date: "2024-09-01" },
    ],
    documents: [],
    activities: [],
  },
  {
    id: "clt_6",
    name: "Green Energy LLC",
    initials: "GE",
    type: "corporate",
    status: "active",
    email: "contact@greenenergy.com",
    phone: "+1 (555) 678-9012",
    company: "Green Energy LLC",
    address: "654 Solar Ave, Austin, TX 78701",
    notes: "Renewable energy sector, growing client",
    activeCases: 4,
    totalCases: 8,
    lastContact: "2026-02-05",
    createdAt: "2024-01-15",
    rating: 4.7,
    cases: [
      { id: "case_9", name: "Environmental Compliance", type: "Regulatory", status: "active", date: "2025-03-10" },
      { id: "case_10", name: "Tax Incentives", type: "Tax", status: "active", date: "2025-07-15" },
    ],
    documents: [
      { id: "doc_7", name: "Environmental Report.pdf", date: "2025-04-01", size: "6.7 MB" },
    ],
    activities: [
      { id: "act_6", type: "meeting", description: "Quarterly review", date: "2026-02-05" },
    ],
  },
];

/* -------------------- MAIN COMPONENT -------------------- */

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [formData, setFormData] = useState({
    name: "",
    type: "individual",
    status: "active",
    email: "",
    phone: "",
    company: "",
    address: "",
    notes: "",
  });

  // Load clients from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem("legalflow_clients");
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      setClients(initialClients);
      localStorage.setItem("legalflow_clients", JSON.stringify(initialClients));
    }
  }, []);

  // Save clients to localStorage
  const saveClients = (updatedClients) => {
    setClients(updatedClients);
    localStorage.setItem("legalflow_clients", JSON.stringify(updatedClients));
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === "active").length,
    corporate: clients.filter(c => c.type === "corporate").length,
    individual: clients.filter(c => c.type === "individual").length,
    totalCases: clients.reduce((sum, c) => sum + c.totalCases, 0),
    activeCases: clients.reduce((sum, c) => sum + c.activeCases, 0),
  };

  // Handle add/edit client
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingClient) {
      const updatedClients = clients.map(client =>
        client.id === editingClient.id
          ? { ...client, ...formData, initials: formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) }
          : client
      );
      saveClients(updatedClients);
    } else {
      const newClient = {
        id: `clt_${Date.now()}`,
        ...formData,
        initials: formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        activeCases: 0,
        totalCases: 0,
        rating: 0,
        cases: [],
        documents: [],
        activities: [],
        createdAt: new Date().toISOString().split("T")[0],
        lastContact: new Date().toISOString().split("T")[0],
      };
      saveClients([...clients, newClient]);
    }

    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({
      name: "",
      type: "individual",
      status: "active",
      email: "",
      phone: "",
      company: "",
      address: "",
      notes: "",
    });
  };

  // Handle delete
  const handleDelete = () => {
    const updatedClients = clients.filter(c => c.id !== selectedClient.id);
    saveClients(updatedClients);
    setIsDeleteModalOpen(false);
    setSelectedClient(null);
  };

  // Open edit modal
  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      type: client.type,
      status: client.status,
      email: client.email,
      phone: client.phone,
      company: client.company || "",
      address: client.address,
      notes: client.notes || "",
    });
    setIsModalOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === "active") {
      return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>;
    }
    return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Inactive</span>;
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    if (rating === 0) return <span className="text-xs text-gray-400">No ratings</span>;
    return (
      <div className="flex items-center gap-0.5">
        <Star size={12} className="fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your client relationships, cases, and documents.</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setFormData({
              name: "",
              type: "individual",
              status: "active",
              email: "",
              phone: "",
              company: "",
              address: "",
              notes: "",
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Total Clients</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Individuals</p>
          <p className="text-xl font-bold text-blue-600">{stats.individual}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Corporate</p>
          <p className="text-xl font-bold text-purple-600">{stats.corporate}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Active Cases</p>
          <p className="text-xl font-bold text-orange-600">{stats.activeCases}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Total Cases</p>
          <p className="text-xl font-bold text-gray-700">{stats.totalCases}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 border border-gray-200 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="individual">Individual</option>
          <option value="corporate">Corporate</option>
        </select>

        <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === "grid" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === "list" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Clients Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-semibold text-green-700 text-base">
                      {client.initials}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 text-base">{client.name}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                          {client.type}
                        </span>
                        {getStatusBadge(client.status)}
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                    <div className="absolute right-0 top-8 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={() => handleEdit(client)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1.5 mb-3">
                  <p className="flex items-center gap-1.5">
                    <Mail size={12} className="text-gray-400" /> {client.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} className="text-gray-400" /> {client.phone}
                  </p>
                  {client.company && (
                    <p className="flex items-center gap-1.5">
                      <Building size={12} className="text-gray-400" /> {client.company}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-gray-400" /> {client.address.substring(0, 35)}...
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-xl text-gray-900">{client.activeCases}</p>
                    <p className="text-gray-500 text-xs">Active Cases</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xl text-gray-900">{client.totalCases}</p>
                    <p className="text-gray-500 text-xs">Total Cases</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Last Contact</p>
                    <p className="text-xs font-medium text-gray-700">{new Date(client.lastContact).toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClient(client)}
                  className="mt-3 w-full text-center text-sm text-green-600 hover:text-green-700 font-medium py-1.5 border-t border-gray-100 -mx-4 px-4 mt-2"
                >
                  View Profile →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Cases</th>
                <th className="px-4 py-3 font-medium">Last Contact</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-semibold text-green-700 text-xs">
                        {client.initials}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div>{client.email}</div>
                    <div className="text-xs text-gray-400">{client.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                      {client.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(client.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {client.activeCases} active / {client.totalCases} total
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(client.lastContact).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(client)} className="text-gray-400 hover:text-green-600">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => setSelectedClient(client)} className="text-gray-400 hover:text-blue-600">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && !isDeleteModalOpen && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={() => {
            handleEdit(selectedClient);
            setSelectedClient(null);
          }}
        />
      )}

      {/* Add/Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingClient ? "Update client information." : "Enter client information to create a new record."}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={22} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Client Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Company (if applicable)</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    placeholder="Additional notes about this client"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {editingClient ? "Save Changes" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
              </div>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete <span className="font-semibold">{selectedClient.name}</span>?
              </p>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- CLIENT DETAIL MODAL -------------------- */

function ClientDetailModal({ client, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "cases", label: "Cases" },
    { id: "documents", label: "Documents" },
    { id: "activities", label: "Activities" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-semibold text-green-700 text-xl">
                {client.initials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{client.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${client.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {client.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onEdit} className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100">
                <Edit size={18} />
              </button>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition relative ${activeTab === tab.id ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Contact Information</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {client.email}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {client.phone}</p>
                    {client.company && <p className="flex items-center gap-2"><Building size={14} className="text-gray-400" /> {client.company}</p>}
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {client.address}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Case Summary</p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{client.activeCases}</p>
                      <p className="text-xs text-gray-500">Active Cases</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{client.totalCases}</p>
                      <p className="text-xs text-gray-500">Total Cases</p>
                    </div>
                  </div>
                </div>
              </div>
              {client.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Notes</p>
                  <p className="text-sm text-gray-700">{client.notes}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Timeline</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> Client since: {new Date(client.createdAt).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /> Last contact: {new Date(client.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cases" && (
            <div className="space-y-3">
              {client.cases.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No cases found for this client.</p>
              ) : (
                client.cases.map((caseItem) => (
                  <div key={caseItem.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{caseItem.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{caseItem.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${caseItem.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {caseItem.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(caseItem.date).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-3">
              {client.documents.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No documents found for this client.</p>
              ) : (
                client.documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-xs text-gray-400">{doc.size} • {new Date(doc.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-700">
                      <Download size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-3">
              {client.activities.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No recent activities.</p>
              ) : (
                client.activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">{activity.type}</p>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}