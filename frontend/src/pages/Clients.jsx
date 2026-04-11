import { useEffect, useRef, useState } from "react";
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Building,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Clock,
  Star,
  AlertCircle,
  Users,
  List,
  Grid,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const typeColor = {
  individual: "bg-blue-100 text-blue-700",
  corporate: "bg-purple-100 text-purple-700",
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    corporate: 0,
    individual: 0,
    totalCases: 0,
    activeCases: 0,
  });
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

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      // Pass the logged-in user ID to filter
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${apiUrl}/api/clients?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load clients.");
      }
      setClients(data);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Pass the logged-in user ID to filter stats
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${apiUrl}/api/clients/stats/summary?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load stats.");
      }

      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchClients();
    fetchStats();
  }, []);

  const handleAddClient = () => {
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
  };

  const handleEditClient = (client) => {
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
    setActiveMenuId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setMessage("Please fill all required fields.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      let response;
      const userId = localStorage.getItem("userId");

      // Inject the userId into the payload when saving
      const payload = { ...formData, userId };

      if (editingClient) {
        response = await fetch(`${apiUrl}/api/clients/${editingClient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${apiUrl}/api/clients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save client.");
      }

      setMessage(editingClient ? "Client updated successfully." : "Client added successfully.");
      setIsModalOpen(false);

      // Refresh both clients and stats after adding/updating
      await fetchClients();
      await fetchStats();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteClient = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/clients/${selectedClient.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete client.");
      }

      setMessage("Client deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedClient(null);

      // Refresh both clients and stats after deletion
      await fetchClients();
      await fetchStats();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleToggleMenu = (clientId, event) => {
    if (event) {
      event.stopPropagation();
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 5,
        right: window.innerWidth - rect.right + 10,
      });
    }
    setActiveMenuId((prev) => (prev === clientId ? null : clientId));
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuId !== null) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  const getStatusBadge = (status) => {
    if (status === "active") {
      return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>;
    }
    return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Inactive</span>;
  };

  const getRatingStars = (rating) => {
    if (rating === 0) return <span className="text-xs text-gray-400">No ratings</span>;
    return (
      <div className="flex items-center gap-0.5">
        <Star size={12} className="fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesType = typeFilter === "all" || client.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const statusOptions = ["all", "active", "inactive"];
  const typeOptions = ["all", "individual", "corporate"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Messages */}
      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm shadow-sm ${message.includes("failed") || message.includes("Unable")
              ? "border-red-200 text-red-600 bg-red-50"
              : "border-green-100 text-green-700 bg-green-50"
            }`}
        >
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-500 text-sm">Manage your client relationships, cases, and documents.</p>
        </div>

        <button
          onClick={handleAddClient}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition shadow-md"
        >
          <Plus size={16} />
          Add Client
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

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search clients by name, email, or company..."
            className="outline-none w-full text-sm bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "All Status" : option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm outline-none"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "All Types" : option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center text-gray-500">Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">No clients found.</div>
          ) : (
            filteredClients.map((client) => (
              <div key={client.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-semibold text-green-700 text-lg">
                      {client.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{client.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[client.type]}`}>
                          {client.type}
                        </span>
                        {getStatusBadge(client.status)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleToggleMenu(client.id, e)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" /> {client.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" /> {client.phone}
                  </p>
                  {client.company && (
                    <p className="flex items-center gap-2">
                      <Building size={14} className="text-gray-400" /> {client.company}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" /> {client.address.substring(0, 35)}...
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
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
                    <p className="text-xs font-medium">{formatDate(client.lastContact)}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClient(client)}
                  className="mt-4 w-full text-center text-sm text-green-600 hover:text-green-700 font-medium py-2 border-t border-gray-100 -mx-5 px-5 mt-3"
                >
                  View Profile →
                </button>

                {activeMenuId === client.id && (
                  <div
                    className="fixed z-50 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
                    style={{
                      top: `${menuPosition.top}px`,
                      right: `${menuPosition.right}px`,
                    }}
                  >
                    <button
                      onClick={() => handleEditClient(client)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setIsDeleteModalOpen(true);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-gray-500 bg-gray-50/50 border-b">
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-4 py-4 font-medium">Contact</th>
                <th className="px-4 py-4 font-medium">Type</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Cases</th>
                <th className="px-4 py-4 font-medium">Last Contact</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading clients...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-lg font-semibold text-green-700 shrink-0">
                          {client.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-400">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">{client.phone}</p>
                      {client.company && <p className="text-xs text-gray-400">{client.company}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[client.type]}`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(client.status)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {client.activeCases} active / {client.totalCases} total
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{formatDate(client.lastContact)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3 text-gray-400">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="hover:text-green-600 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="hover:text-blue-600 transition"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => handleToggleMenu(client.id, e)}
                            className="hover:text-gray-700 transition"
                            title="More actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Global Menu Dropdown */}
      {activeMenuId && (
        <div
          className="fixed z-50 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
          }}
        >
          {(() => {
            const client = clients.find((c) => c.id === activeMenuId);
            if (!client) return null;
            return (
              <>
                <button
                  onClick={() => {
                    handleEditClient(client);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setIsDeleteModalOpen(true);
                    setActiveMenuId(null);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold">{editingClient ? "Edit Client" : "Add New Client"}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingClient ? "Update client information." : "Enter client information to create a new record."}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-100 p-1 rounded">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full border rounded-lg px-3 py-2 outline-green-600"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Client Type</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 outline-green-600"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full border rounded-lg px-3 py-2 outline-green-600"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full border rounded-lg px-3 py-2 outline-green-600"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Company (if applicable)</label>
                  <input
                    type="text"
                    placeholder="Company name"
                    className="w-full border rounded-lg px-3 py-2 outline-green-600"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 outline-green-600"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input
                    type="text"
                    placeholder="Full address"
                    className="w-full border rounded-lg px-3 py-2 outline-green-600"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Additional notes about this client"
                    className="w-full border rounded-lg px-3 py-2 outline-green-600 resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                >
                  {editingClient ? "Save Changes" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && !isDeleteModalOpen && (
        <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} onEdit={handleEditClient} />
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
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={handleDeleteClient} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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

// Client Detail Modal Component
function ClientDetailModal({ client, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                    {client.type}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${client.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {client.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onEdit(client);
                  onClose();
                }}
                className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100"
              >
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
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" /> {client.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" /> {client.phone}
                    </p>
                    {client.company && (
                      <p className="flex items-center gap-2">
                        <Building size={14} className="text-gray-400" /> {client.company}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" /> {client.address}
                    </p>
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
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" /> Client since: {formatDate(client.createdAt)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" /> Last contact: {formatDate(client.lastContact)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cases" && (
            <div className="space-y-3">
              {client.cases && client.cases.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No cases found for this client.</p>
              ) : (
                <p className="text-center text-gray-400 py-8">Cases will appear here once linked.</p>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-3">
              {client.documents && client.documents.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No documents found for this client.</p>
              ) : (
                <p className="text-center text-gray-400 py-8">Documents will appear here once linked.</p>
              )}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-3">
              {client.activities && client.activities.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No recent activities.</p>
              ) : (
                <p className="text-center text-gray-400 py-8">Activities will appear here once added.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 