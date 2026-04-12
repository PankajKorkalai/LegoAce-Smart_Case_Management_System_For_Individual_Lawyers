const express = require("express");
const Client = require("../models/Clients.model");

const router = express.Router();

// Dummy data for initial stage
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
    cases: [],
    documents: [],
    activities: [],
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
    cases: [],
    documents: [],
    activities: [],
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
    cases: [],
    documents: [],
    activities: [],
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
    cases: [],
    documents: [],
    activities: [],
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
    cases: [],
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
    cases: [],
    documents: [],
    activities: [],
  },
];

// Initialize dummy data
const initializeDummyData = async () => {
  try {
    const count = await Client.countDocuments();
    if (count === 0) {
      await Client.insertMany(initialClients);
    }
  } catch (error) {
    console.error("Error initializing dummy data:", error);
  }
};

initializeDummyData();

// GET all clients (Filtered by Lawyer)
router.get("/clients", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {}; // Fetch all clients irrespective of selection
    
    const clients = await Client.find(query).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    res.status(500).json({ error: "Unable to fetch clients." });
  }
});

// GET single client
router.get("/clients/:id", async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }
    res.json(client);
  } catch (error) {
    console.error("Failed to fetch client:", error);
    res.status(500).json({ error: "Unable to fetch client." });
  }
});

// GET client statistics (Filtered by Lawyer)
router.get("/clients/stats/summary", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {}; // Fetch all statistics irrespective of selection

    const total = await Client.countDocuments(query);
    const active = await Client.countDocuments({ ...query, status: "active" });
    const corporate = await Client.countDocuments({ ...query, type: "corporate" });
    const individual = await Client.countDocuments({ ...query, type: "individual" });

    const clients = await Client.find(query);
    const totalCases = clients.reduce((sum, client) => sum + client.totalCases, 0);
    const activeCases = clients.reduce((sum, client) => sum + client.activeCases, 0);

    res.json({
      total,
      active,
      corporate,
      individual,
      totalCases,
      activeCases,
    });
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    res.status(500).json({ error: "Unable to fetch statistics." });
  }
});

// POST add new client
router.post("/clients", async (req, res) => {
  try {
    // Extracted userId from the body payload
    const { name, type, status, email, phone, company, address, notes, userId } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: "Missing required fields: name, email, phone, address" });
    }

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const id = `clt_${Date.now()}`;

    const newClient = new Client({
      id,
      name,
      initials,
      type: type || "individual",
      status: status || "active",
      email,
      phone,
      company: company || "",
      address,
      notes: notes || "",
      activeCases: 0,
      totalCases: 0,
      rating: 0,
      cases: [],
      documents: [],
      activities: [],
      lastContact: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: userId, // Link the client to the specific lawyer
    });

    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("Failed to add client:", error);
    res.status(500).json({ error: "Unable to add client." });
  }
});

// PUT update client
router.put("/clients/:id", async (req, res) => {
  try {
    const { name, type, status, email, phone, company, address, notes } = req.body;

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const updatedClient = await Client.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        initials,
        type,
        status,
        email,
        phone,
        company: company || "",
        address,
        notes: notes || "",
        lastContact: new Date().toISOString().split("T")[0],
      },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.json(updatedClient);
  } catch (error) {
    console.error("Failed to update client:", error);
    res.status(500).json({ error: "Unable to update client." });
  }
});

// DELETE client
router.delete("/clients/:id", async (req, res) => {
  try {
    const deletedClient = await Client.findOneAndDelete({ id: req.params.id });

    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.json({ message: "Client deleted successfully." });
  } catch (error) {
    console.error("Failed to delete client:", error);
    res.status(500).json({ error: "Unable to delete client." });
  }
});

module.exports = router;