import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import Student from "../models/Student.js";
import Outpass from "../models/Outpass.js";
import Complaint from "../models/Complaint.js";
import Notice from "../models/Notice.js";
import Request from "../models/Request.js";
import MessMenu from "../models/MessMenu.js";
import Marketplace from "../models/Marketplace.js";
import Attendance from "../models/Attendance.js";

import {
  INITIAL_USERS,
  INITIAL_HOSTELS,
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_REQUESTS,
  INITIAL_OUTPASSES,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  INITIAL_MESS_MENU,
  INITIAL_MARKETPLACE,
  INITIAL_ATTENDANCE,
} from "./seedData.js";

async function runSeed() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pcte_hostel";

  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri);
    console.log("Connected to MongoDB. Beginning database seeding...");

    // 1. Users
    await User.deleteMany({});
    for (const u of INITIAL_USERS) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await User.create({
        ...u,
        password: hashedPassword,
      });
    }
    console.log(`✔ Seeded ${INITIAL_USERS.length} users.`);

    // 2. Hostels
    await Hostel.deleteMany({});
    await Hostel.insertMany(INITIAL_HOSTELS);
    console.log(`✔ Seeded ${INITIAL_HOSTELS.length} hostels.`);

    // 3. Rooms
    await Room.deleteMany({});
    await Room.insertMany(INITIAL_ROOMS);
    console.log(`✔ Seeded ${INITIAL_ROOMS.length} rooms.`);

    // 4. Students
    await Student.deleteMany({});
    await Student.insertMany(INITIAL_STUDENTS);
    console.log(`✔ Seeded ${INITIAL_STUDENTS.length} students.`);

    // 5. Room Requests
    await Request.deleteMany({});
    await Request.insertMany(INITIAL_REQUESTS);
    console.log(`✔ Seeded ${INITIAL_REQUESTS.length} room change requests.`);

    // 6. Outpasses
    await Outpass.deleteMany({});
    await Outpass.insertMany(INITIAL_OUTPASSES);
    console.log(`✔ Seeded ${INITIAL_OUTPASSES.length} outpasses.`);

    // 7. Complaints
    await Complaint.deleteMany({});
    await Complaint.insertMany(INITIAL_COMPLAINTS);
    console.log(`✔ Seeded ${INITIAL_COMPLAINTS.length} complaints.`);

    // 8. Notices
    await Notice.deleteMany({});
    await Notice.insertMany(INITIAL_NOTICES);
    console.log(`✔ Seeded ${INITIAL_NOTICES.length} notices.`);

    // 9. Mess Menu
    await MessMenu.deleteMany({});
    const messDocs = Object.entries(INITIAL_MESS_MENU).map(([day, meals]) => ({
      day,
      ...meals,
    }));
    await MessMenu.insertMany(messDocs);
    console.log(`✔ Seeded ${messDocs.length} mess menu days.`);

    // 10. Marketplace
    await Marketplace.deleteMany({});
    await Marketplace.insertMany(INITIAL_MARKETPLACE);
    console.log(`✔ Seeded ${INITIAL_MARKETPLACE.length} marketplace listings.`);

    // 11. Attendance
    await Attendance.deleteMany({});
    for (const [date, records] of Object.entries(INITIAL_ATTENDANCE)) {
      await Attendance.create({ date, records });
    }
    console.log(`✔ Seeded attendance records.`);

    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

runSeed();
