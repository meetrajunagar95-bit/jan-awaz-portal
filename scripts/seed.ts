import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import Complaint, { ComplaintCategory, ComplaintStatus } from "../src/models/Complaint";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI environment variable is not defined.");
  process.exit(1);
}

const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@janawaz.gov.in";
const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@JanAwaz2026";
const adminName = process.env.DEFAULT_ADMIN_NAME || "Chief Grievance Officer";

interface SampleComplaint {
  complaintId: string;
  name: string;
  email: string;
  phone: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  status: ComplaintStatus;
  remarks: string;
  timeline: Array<{
    status: ComplaintStatus;
    message: string;
    updatedBy: string;
    timestamp: Date;
  }>;
}

const sampleComplaints: SampleComplaint[] = [
  {
    complaintId: "JA-2026-0001",
    name: "Rajeshbhai Patel",
    email: "rajesh.patel@gmail.com",
    phone: "9825100001",
    category: "Roads",
    title: "Large potholes near Sir Bhavsinhji Polytechnic main gate",
    description:
      "Deep potholes have developed right outside the main institute entrance following recent rains. This creates severe difficulty and skid hazards for two-wheelers and students commuting daily.",
    location: "Main Gate Road, Sir BPTI Campus, Vidyanagar, Bhavnagar",
    status: "In Progress",
    remarks: "PWD road repair squad dispatched for asphalt patching work.",
    timeline: [
      {
        status: "Pending",
        message: "Grievance submitted by citizen through portal.",
        updatedBy: "Citizen Portal",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        status: "In Progress",
        message: "Inspection conducted by Ward Engineer. Road repair work order issued to contractor.",
        updatedBy: "Ward Engineer",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    complaintId: "JA-2026-0002",
    name: "Pooja Varma",
    email: "pooja.v@outlook.com",
    phone: "9825100002",
    category: "Water",
    title: "Drinking water pipeline leak near Ghogha Circle",
    description:
      "Underground municipal water pipeline has burst, causing hundreds of liters of clean drinking water to flood the road for the past 24 hours.",
    location: "Near Ghogha Circle, Bhavnagar",
    status: "Resolved",
    remarks: "Hydraulic engineering wing repaired pipeline joint. Water supply normalized.",
    timeline: [
      {
        status: "Pending",
        message: "Grievance submitted by citizen through portal.",
        updatedBy: "Citizen Portal",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        status: "In Progress",
        message: "Repair crew deployed with excavation equipment to fix the fracture.",
        updatedBy: "Water Works Department",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        status: "Resolved",
        message: "Pipeline joint sealed, pressure test passed, and road surface backfilled.",
        updatedBy: "Water Works Department",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    complaintId: "JA-2026-0003",
    name: "Amit Solanki",
    email: "amit.solanki@gmail.com",
    phone: "9825100003",
    category: "Electricity",
    title: "Streetlights not functioning on Ruva Ring Road",
    description:
      "More than 10 consecutive streetlights are completely off along Ruva Ring Road, causing unsafe darkness at night for commuters and pedestrians.",
    location: "Ruva Ring Road, Ward 7, Bhavnagar",
    status: "Pending",
    remarks: "Complaint received and forwarded to Electrical Maintenance cell.",
    timeline: [
      {
        status: "Pending",
        message: "Grievance registered. Awaiting technician assignment.",
        updatedBy: "Citizen Portal",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ],
  },
  {
    complaintId: "JA-2026-0004",
    name: "Meenaben Dave",
    email: "meena.dave@yahoo.com",
    phone: "9825100004",
    category: "Sanitation",
    title: "Overflowing community garbage container in Chitra area",
    description:
      "The secondary waste bin near vegetable market has not been emptied for 4 days. Waste is spilling over the road causing foul odor and health concerns.",
    location: "Market Square, Chitra GIDC, Bhavnagar",
    status: "Resolved",
    remarks: "Solid Waste Management team cleared container and disinfected surrounding area.",
    timeline: [
      {
        status: "Pending",
        message: "Grievance submitted by citizen.",
        updatedBy: "Citizen Portal",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        status: "In Progress",
        message: "Compactor vehicle assigned to lift overflow waste.",
        updatedBy: "Sanitation Supervisor",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        status: "Resolved",
        message: "Area cleared and lime powder sanitization completed.",
        updatedBy: "Sanitation Inspector",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    complaintId: "JA-2026-0005",
    name: "Karan Mehta",
    email: "karan.mehta@gmail.com",
    phone: "9825100005",
    category: "Health",
    title: "Mosquito breeding due to stagnant rainwater near Subhashnagar PHC",
    description:
      "Open plot adjacent to the Primary Health Centre has stagnant muddy water accumulating for two weeks, increasing dengue and malaria threat.",
    location: "Plot 42, Behind Subhashnagar PHC, Bhavnagar",
    status: "In Progress",
    remarks: "Vector Control team conducted anti-larval spraying; drainage suction in progress.",
    timeline: [
      {
        status: "Pending",
        message: "Grievance registered and assigned to Health Officer.",
        updatedBy: "Citizen Portal",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        status: "In Progress",
        message: "Larvicide spraying completed; water suction pump mobilized.",
        updatedBy: "Vector Control Department",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ],
  },
  {
    complaintId: "JA-2026-0006",
    name: "Sunil Gohil",
    email: "sunil.gohil@gmail.com",
    phone: "9825100006",
    category: "Education",
    title: "Requirement of speed breaker in front of Government Primary School",
    description:
      "Vehicles speed excessively in front of school gate during dispersal time. Request immediate installation of rubberized speed breaker and warning signage.",
    location: "Kalanala School No. 12, Bhavnagar",
    status: "Pending",
    remarks: "Forwarded to Traffic Engineering and School Infrastructure Committee.",
    timeline: [
      {
        status: "Pending",
        message: "Grievance registered for traffic safety review.",
        updatedBy: "Citizen Portal",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Starting Jan Awaz Portal Database Seeder...");

  try {
    await mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(" Connected to MongoDB successfully.");

    // 1. Seed Default Admin User
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        phone: "9825000000",
      });
      console.log(` Created Admin Account: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`ℹ️ Admin account already exists: ${adminEmail}`);
    }

    // 2. Seed Default Citizen User for testing citizen login
    const citizenEmail = "citizen@janawaz.gov.in";
    const existingCitizen = await User.findOne({ email: citizenEmail });
    if (!existingCitizen) {
      const hashedCitizenPassword = await bcrypt.hash("Citizen@123", 10);
      await User.create({
        name: "Darshan Trivedi",
        email: citizenEmail,
        password: hashedCitizenPassword,
        role: "citizen",
        phone: "9825199999",
      });
      console.log(` Created Citizen Demo Account: ${citizenEmail} / Citizen@123`);
    }

    // 3. Seed Sample Complaints
    for (const sample of sampleComplaints) {
      const exists = await Complaint.findOne({ complaintId: sample.complaintId });
      if (!exists) {
        await Complaint.create(sample);
        console.log(` Created sample complaint: ${sample.complaintId} (${sample.category})`);
      }
    }

    const totalComplaints = await Complaint.countDocuments();
    const totalUsers = await User.countDocuments();

    console.log("==========================================");
    console.log("🎉 Seeding Completed Successfully!");
    console.log(`📊 Total Users in DB: ${totalUsers}`);
    console.log(`📊 Total Complaints in DB: ${totalComplaints}`);
    console.log("==========================================");
    console.log("🔑 Admin Login: " + adminEmail + " | " + adminPassword);
    console.log("🔑 Citizen Login: citizen@janawaz.gov.in | Citizen@123");
    console.log("==========================================");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB.");
    process.exit(0);
  }
}

seed();
