import { MoreVertical, Mail, Phone, MapPin, Building } from "lucide-react";

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
  return (
    <div className=" bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-500">
            Manage your client relationships and contact information
          </p>
        </div>

        <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
          + Add Client
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search clients by name, email, or company..."
          className="flex-1 px-4 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <select className="px-3 py-2 rounded-lg bg-white shadow-sm">
          <option>All Status</option>
        </select>

        <select className="px-3 py-2 rounded-lg bg-white shadow-sm">
          <option>All Types</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Top */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                  {client.initials}
                </div>

                <div>
                  <h2 className="font-semibold">{client.name}</h2>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                      {client.type}
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>

              <MoreVertical size={18} className="text-gray-500 cursor-pointer" />
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center gap-2">
                <Mail size={14} /> {client.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} /> {client.phone}
              </p>

              {client.company && (
                <p className="flex items-center gap-2">
                  <Building size={14} /> {client.company}
                </p>
              )}

              <p className="flex items-center gap-2">
                <MapPin size={14} /> {client.address}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t my-4"></div>

            {/* Stats */}
            <div className="flex justify-between text-sm">
              <div>
                <p className="font-semibold text-lg">
                  {client.activeCases}
                </p>
                <p className="text-gray-500">Active Cases</p>
              </div>

              <div>
                <p className="font-semibold text-lg">
                  {client.totalCases}
                </p>
                <p className="text-gray-500">Total Cases</p>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-xs">Last Contact</p>
                <p>{client.lastContact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}