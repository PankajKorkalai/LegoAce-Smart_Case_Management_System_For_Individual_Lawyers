import { useState } from "react";
import { MoreVertical, Mail, Phone, MapPin, Building, X, Search, ChevronDown } from "lucide-react";

const clients = [
  {
    name: "John Smith",
    initials: "JS",
    type: "individual",
    status: "active",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    company: "Smith Enterprises",
    address: "123 Main St, Los Angeles, CA",
    activeCases: 2,
    totalCases: 5,
    lastContact: "Feb 1, 2026",
  },
  {
    name: "Maria Rodriguez",
    initials: "MR",
    type: "individual",
    status: "active",
    email: "maria.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, San Francisco, CA",
    activeCases: 1,
    totalCases: 1,
    lastContact: "Jan 28, 2026",
  },
  {
    name: "Tech Corp Inc",
    initials: "TC",
    type: "corporate",
    status: "active",
    email: "legal@techcorp.com",
    phone: "+1 (555) 345-6789",
    company: "Tech Corp Inc",
    address: "789 Silicon Way, San Jose, CA",
    activeCases: 1,
    totalCases: 3,
    lastContact: "Jan 25, 2026",
  },
  {
    name: "Robert Davis",
    initials: "RD",
    type: "corporate",
    status: "active",
    email: "robert.davis@email.com",
    phone: "+1 (555) 456-7890",
    company: "Davis Holdings",
    address: "321 Market St, New York, NY",
    activeCases: 3,
    totalCases: 6,
    lastContact: "Feb 3, 2026",
  },
  {
    name: "James Wilson",
    initials: "JW",
    type: "individual",
    status: "active",
    email: "james.wilson@email.com",
    phone: "+1 (555) 567-8901",
    address: "987 Pine St, Seattle, WA",
    activeCases: 2,
    totalCases: 4,
    lastContact: "Jan 30, 2026",
  },
  {
    name: "Green Energy LLC",
    initials: "GE",
    type: "corporate",
    status: "active",
    email: "contact@greenenergy.com",
    phone: "+1 (555) 678-9012",
    company: "Green Energy LLC",
    address: "654 Solar Ave, Austin, TX",
    activeCases: 4,
    totalCases: 8,
    lastContact: "Feb 5, 2026",
  },
];

export default function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    clientType: "individual",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New client:", formData);
    setIsModalOpen(false);
    setFormData({
      fullName: "",
      clientType: "individual",
      email: "",
      phone: "",
      companyName: "",
      address: "",
      notes: "",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your client relations.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition flex items-center gap-2 text-sm font-medium"
        >
          <span className="text-lg">+</span> Add Client
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients, documents..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 border border-gray-200 text-sm"
          />
        </div>

        <select className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer">
          <option>All Types</option>
          <option>Individual</option>
          <option>Corporate</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((client, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            {/* Top */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-semibold text-green-700 text-base">
                  {client.initials}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 text-base">{client.name}</h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {client.type}
                  </span>
                </div>
              </div>

              <MoreVertical size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>

            {/* Info */}
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

            {/* Stats */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div>
                <p className="font-semibold text-xl text-gray-900">{client.activeCases}</p>
                <p className="text-gray-500 text-xs">Active Cases</p>
              </div>

              <div>
                <p className="font-semibold text-xl text-gray-900">{client.totalCases}</p>
                <p className="text-gray-500 text-xs">Total</p>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-xs">Last Contact</p>
                <p className="text-xs font-medium text-gray-700">{client.lastContact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Wider Dialog Box (unchanged) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add New Client</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the client information to create a new record.
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
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name / Company Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Client Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Client Type
                  </label>
                  <select
                    name="clientType"
                    value={formData.clientType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition appearance-none cursor-pointer"
                  >
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Company Name (if applicable)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Company name"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Notes - Full width */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes about this client"
                  rows={3}
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
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}