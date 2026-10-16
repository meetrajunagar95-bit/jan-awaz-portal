import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface MemoryComplaint {
  _id: string;
  complaintId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  remarks?: string;
  timeline: Array<{
    status: "Pending" | "In Progress" | "Resolved" | "Rejected";
    message: string;
    updatedBy: string;
    timestamp: string | Date;
  }>;
  userId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface MemoryUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "citizen" | "admin";
  phone?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface StoreData {
  complaints: MemoryComplaint[];
  users: MemoryUser[];
  initialized: boolean;
}

// Storage path: in production on serverless/Render /tmp or .data fallback
const DATA_DIR = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "jan_awaz_store.json");

function getInitialUsers(): MemoryUser[] {
  const adminHash = bcrypt.hashSync("Admin@JanAwaz2026", 10);
  const citizenHash = bcrypt.hashSync("Citizen@123", 10);
  const now = new Date().toISOString();

  return [
    {
      _id: "user_admin_001",
      name: "Chief Grievance Officer",
      email: "admin@janawaz.gov.in",
      password: adminHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: "user_citizen_001",
      name: "Rajesh V. Parmar",
      email: "citizen@janawaz.gov.in",
      password: citizenHash,
      role: "citizen",
      phone: "+91 98250 12345",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function getInitialComplaints(): MemoryComplaint[] {
  const now = new Date();
  const d1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const d2 = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();
  const d3 = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();
  const d4 = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString();
  const d5 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
  const d6 = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      _id: "comp_001",
      complaintId: "JA-2026-0001",
      name: "Rajesh V. Parmar",
      email: "citizen@janawaz.gov.in",
      phone: "+91 98250 12345",
      category: "Roads",
      title: "Dangerous potholes on Waghawadi Road junction",
      description: "Multiple severe potholes near Sir BPI college road causing traffic hazards and two-wheeler skids during rush hours.",
      location: "Waghawadi Road near BPI College, Bhavnagar",
      status: "In Progress",
      remarks: "Road engineering squad dispatched for hot-mix bitumen filling.",
      timeline: [
        {
          status: "Pending",
          message: "Grievance submitted by citizen and registered in portal.",
          updatedBy: "Citizen Portal",
          timestamp: d1,
        },
        {
          status: "In Progress",
          message: "Road engineering squad dispatched for hot-mix bitumen filling.",
          updatedBy: "Ward Inspector",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: d1,
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "comp_002",
      complaintId: "JA-2026-0002",
      name: "Amit H. Shah",
      email: "amit.shah@example.com",
      phone: "+91 98791 23456",
      category: "Water",
      title: "Contaminated muddy water supply in Nilambaug area",
      description: "Tap water has noticeable yellowish turbidity and foul smell for the past 48 hours. Poses severe health hazards to elderly and school children.",
      location: "Nilambaug Society, Sector 3, Bhavnagar",
      status: "Pending",
      remarks: "Water sample testing scheduled with public health laboratory.",
      timeline: [
        {
          status: "Pending",
          message: "Grievance submitted by citizen and registered in portal.",
          updatedBy: "Citizen Portal",
          timestamp: d2,
        },
      ],
      createdAt: d2,
      updatedAt: d2,
    },
    {
      _id: "comp_003",
      complaintId: "JA-2026-0003",
      name: "Meena K. Patel",
      email: "meena.patel@example.com",
      phone: "+91 94262 34567",
      category: "Electricity",
      title: "Flickering streetlights creating dark zone on Kalanala Bridge",
      description: "Three consecutive LED poles remain non-operational after 7 PM, creating safety hazards for female pedestrians.",
      location: "Kalanala Flyover approach, Bhavnagar",
      status: "Resolved",
      remarks: "Defective junction box circuit breaker replaced by electrical line maintenance crew.",
      timeline: [
        {
          status: "Pending",
          message: "Grievance registered in municipal portal.",
          updatedBy: "Citizen Portal",
          timestamp: d3,
        },
        {
          status: "In Progress",
          message: "Electrical contractor assigned job ticket #EL-409.",
          updatedBy: "Junior Engineer",
          timestamp: d2,
        },
        {
          status: "Resolved",
          message: "Defective junction box circuit breaker replaced by electrical line maintenance crew.",
          updatedBy: "Chief Grievance Officer",
          timestamp: d1,
        },
      ],
      createdAt: d3,
      updatedAt: d1,
    },
    {
      _id: "comp_004",
      complaintId: "JA-2026-0004",
      name: "Dharmesh S. Trivedi",
      email: "dharmesh.trivedi@example.com",
      phone: "+91 97243 45678",
      category: "Sanitation",
      title: "Overflowing garbage bin near Vegetable Market",
      description: "Community trash container unemptied for four days; attracting stray cattle and spreading stench across primary school perimeter.",
      location: "Old Subhash Vegetable Market, Bhavnagar",
      status: "Resolved",
      remarks: "Hydraulic compactor truck deployed; area disinfected with bleaching powder.",
      timeline: [
        {
          status: "Pending",
          message: "Grievance registered in municipal portal.",
          updatedBy: "Citizen Portal",
          timestamp: d4,
        },
        {
          status: "Resolved",
          message: "Hydraulic compactor truck deployed; area disinfected with bleaching powder.",
          updatedBy: "Sanitary Inspector",
          timestamp: d2,
        },
      ],
      createdAt: d4,
      updatedAt: d2,
    },
    {
      _id: "comp_005",
      complaintId: "JA-2026-0005",
      name: "Pooja N. Mehta",
      email: "pooja.mehta@example.com",
      phone: "+91 99090 56789",
      category: "Health",
      title: "Stagnant rainwater breeding mosquitoes in empty plot",
      description: "Unfenced vacant municipal property collecting monsoon drainage water, resulting in sharp spike in dengue and malaria cases.",
      location: "Plot 42, Ghogha Circle Colony, Bhavnagar",
      status: "In Progress",
      remarks: "Larvicide fogging done; notice issued to plot owner for soil backfill.",
      timeline: [
        {
          status: "Pending",
          message: "Grievance submitted by citizen.",
          updatedBy: "Citizen Portal",
          timestamp: d5,
        },
        {
          status: "In Progress",
          message: "Larvicide fogging done; notice issued to plot owner for soil backfill.",
          updatedBy: "Health Officer",
          timestamp: d3,
        },
      ],
      createdAt: d5,
      updatedAt: d3,
    },
    {
      _id: "comp_006",
      complaintId: "JA-2026-0006",
      name: "Bhavik J. Joshi",
      email: "bhavik.joshi@example.com",
      phone: "+91 98980 67890",
      category: "Education",
      title: "Damaged perimeter boundary wall at Municipal Primary School",
      description: "Over 15 feet of brick wall collapsed into adjoining ravine, exposing young students to safety hazards during recess.",
      location: "Municipal Primary School No. 14, Chitra, Bhavnagar",
      status: "Pending",
      remarks: "Structural safety assessment team notified for on-site inspection.",
      timeline: [
        {
          status: "Pending",
          message: "Grievance logged; prioritized under child safety protocol.",
          updatedBy: "Citizen Portal",
          timestamp: d6,
        },
      ],
      createdAt: d6,
      updatedAt: d6,
    },
  ];
}

// Global in-memory storage singleton for fast server response
declare global {
  var __memoryStore: StoreData | undefined;
}

function loadStore(): StoreData {
  if (global.__memoryStore) {
    return global.__memoryStore;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      global.__memoryStore = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Could not read local store file, initializing fresh memory store:", err);
  }

  const initial: StoreData = {
    complaints: getInitialComplaints(),
    users: getInitialUsers(),
    initialized: true,
  };

  global.__memoryStore = initial;
  saveStore(initial);
  return initial;
}

function saveStore(store: StoreData) {
  global.__memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    // In restricted serverless envs, memory is still kept via global.__memoryStore
    console.warn("Failed to persist store to disk, keeping in memory:", err);
  }
}

export const memoryStore = {
  getComplaints(filter?: {
    search?: string;
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
    email?: string;
  }) {
    const store = loadStore();
    let list = [...store.complaints];

    if (filter?.category && filter.category !== "All") {
      list = list.filter((c) => c.category === filter.category);
    }

    if (filter?.status && filter.status !== "All") {
      list = list.filter((c) => c.status === filter.status);
    }

    if (filter?.startDate) {
      const s = new Date(filter.startDate).getTime();
      list = list.filter((c) => new Date(c.createdAt).getTime() >= s);
    }

    if (filter?.endDate) {
      const e = new Date(filter.endDate);
      e.setHours(23, 59, 59, 999);
      const endMs = e.getTime();
      list = list.filter((c) => new Date(c.createdAt).getTime() <= endMs);
    }

    if (filter?.userId || filter?.email) {
      list = list.filter(
        (c) =>
          (filter.userId && c.userId === filter.userId) ||
          (filter.email && c.email.toLowerCase() === filter.email.toLowerCase())
      );
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.complaintId.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getComplaintById(idOrComplaintId: string): MemoryComplaint | null {
    const store = loadStore();
    const clean = idOrComplaintId.trim().toLowerCase();
    return (
      store.complaints.find(
        (c) => c._id === idOrComplaintId || c.complaintId.toLowerCase() === clean
      ) || null
    );
  },

  createComplaint(
    data: Omit<
      MemoryComplaint,
      "_id" | "complaintId" | "createdAt" | "updatedAt" | "timeline" | "status" | "remarks"
    > & {
      status?: "Pending" | "In Progress" | "Resolved" | "Rejected";
      remarks?: string;
      timeline?: MemoryComplaint["timeline"];
    }
  ): MemoryComplaint {
    const store = loadStore();
    const count = store.complaints.length;
    const year = new Date().getFullYear();
    const complaintId = `JA-${year}-${String(count + 1).padStart(4, "0")}`;
    const now = new Date().toISOString();

    const newComp: MemoryComplaint = {
      _id: "comp_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      complaintId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      category: data.category,
      title: data.title,
      description: data.description,
      location: data.location,
      imageUrl: data.imageUrl || "",
      status: data.status || "Pending",
      remarks: data.remarks || "Complaint received and queued for review.",
      userId: data.userId,
      timeline: data.timeline && data.timeline.length > 0 ? data.timeline : [
        {
          status: data.status || "Pending",
          message: "Grievance submitted by citizen and registered in portal.",
          updatedBy: "Citizen Portal",
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    store.complaints.unshift(newComp);
    saveStore(store);
    return newComp;
  },

  updateComplaint(
    idOrComplaintId: string,
    updates: Partial<MemoryComplaint> & {
      newTimelineItem?: {
        status: "Pending" | "In Progress" | "Resolved" | "Rejected";
        message: string;
        updatedBy: string;
      };
    }
  ): MemoryComplaint | null {
    const store = loadStore();
    const index = store.complaints.findIndex(
      (c) =>
        c._id === idOrComplaintId ||
        c.complaintId.toLowerCase() === idOrComplaintId.trim().toLowerCase()
    );

    if (index === -1) return null;

    const current = store.complaints[index];
    const updated: MemoryComplaint = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.newTimelineItem) {
      updated.timeline = [
        ...current.timeline,
        {
          ...updates.newTimelineItem,
          timestamp: new Date().toISOString(),
        },
      ];
    }

    store.complaints[index] = updated;
    saveStore(store);
    return updated;
  },

  getUserByEmail(email: string): MemoryUser | null {
    const store = loadStore();
    return (
      store.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      ) || null
    );
  },

  getUserById(id: string): MemoryUser | null {
    const store = loadStore();
    return store.users.find((u) => u._id === id) || null;
  },

  createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role?: "citizen" | "admin";
    phone?: string;
  }): MemoryUser {
    const store = loadStore();
    const now = new Date().toISOString();
    const newUser: MemoryUser = {
      _id: "user_" + Date.now(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.passwordHash,
      role: userData.role || "citizen",
      phone: userData.phone,
      createdAt: now,
      updatedAt: now,
    };

    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },
};
