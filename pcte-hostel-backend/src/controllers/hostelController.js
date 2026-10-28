import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getAllHostels(req, res, next) {
  try {
    if (isMongoConnected()) {
      const hostels = await Hostel.find().lean();
      return res.status(200).json({ success: true, data: hostels });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, data: store.hostels });
    }
  } catch (err) {
    next(err);
  }
}

export async function createHostel(req, res, next) {
  try {
    const { name, totalRooms = 15 } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Hostel block name is required" });
    }

    const blockLetter = name.replace(/[^A-Za-z0-9]/g, "").slice(-1).toUpperCase() || "D";
    const initialRoomsData = [
      { room: `${blockLetter}-101`, block: name, floor: 1, type: "Single", capacity: 1, occupied: 0, students: [], maintenance: false },
      { room: `${blockLetter}-102`, block: name, floor: 1, type: "Double", capacity: 2, occupied: 0, students: [], maintenance: false },
      { room: `${blockLetter}-103`, block: name, floor: 1, type: "Double", capacity: 2, occupied: 0, students: [], maintenance: false },
    ];

    if (isMongoConnected()) {
      const existing = await Hostel.findOne({ name: new RegExp(`^${name}$`, "i") });
      if (existing) {
        return res.status(409).json({ success: false, message: "Hostel block already exists" });
      }

      const newHostel = await Hostel.create({ name, rooms: Number(totalRooms), occupied: 0 });
      await Room.insertMany(initialRoomsData);

      return res.status(201).json({ success: true, data: newHostel, message: "Hostel block created successfully" });
    } else {
      const store = getStore();
      const existing = store.hostels.some((h) => h.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        return res.status(409).json({ success: false, message: "Hostel block already exists" });
      }

      const newHostel = { name, rooms: Number(totalRooms), occupied: 0 };
      store.hostels.push(newHostel);
      store.rooms.push(...initialRoomsData);
      saveStore();

      return res.status(201).json({ success: true, data: newHostel, message: "Hostel block created successfully" });
    }
  } catch (err) {
    next(err);
  }
}
