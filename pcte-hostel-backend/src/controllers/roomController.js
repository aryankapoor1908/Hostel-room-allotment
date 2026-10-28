import Room from "../models/Room.js";
import Student from "../models/Student.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getAllRooms(req, res, next) {
  try {
    const { block, floor, maintenance } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (block) filter.block = block;
      if (floor) filter.floor = Number(floor);
      if (maintenance !== undefined) filter.maintenance = maintenance === "true";

      const rooms = await Room.find(filter).lean();
      return res.status(200).json({ success: true, data: rooms });
    } else {
      const store = getStore();
      let filtered = [...store.rooms];
      if (block) filtered = filtered.filter((r) => r.block.toLowerCase() === block.toLowerCase());
      if (floor) filtered = filtered.filter((r) => r.floor === Number(floor));
      if (maintenance !== undefined) filtered = filtered.filter((r) => r.maintenance === (maintenance === "true"));

      return res.status(200).json({ success: true, data: filtered });
    }
  } catch (err) {
    next(err);
  }
}

export async function flagMaintenance(req, res, next) {
  try {
    const { roomNumber } = req.params;
    const { isMaintenance = true } = req.body;

    if (isMongoConnected()) {
      const room = await Room.findOneAndUpdate(
        { room: new RegExp(`^${roomNumber}$`, "i") },
        { maintenance: Boolean(isMaintenance) },
        { new: true }
      );
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
      return res.status(200).json({ success: true, data: room, message: "Room maintenance status updated" });
    } else {
      const store = getStore();
      const room = store.rooms.find((r) => r.room.toLowerCase() === roomNumber.toLowerCase());
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
      room.maintenance = Boolean(isMaintenance);
      saveStore();
      return res.status(200).json({ success: true, data: room, message: "Room maintenance status updated" });
    }
  } catch (err) {
    next(err);
  }
}

export async function runAllotment(req, res, next) {
  try {
    if (isMongoConnected()) {
      const pendingStudents = await Student.find({ status: "pending" });
      const availableRooms = await Room.find({ maintenance: false });

      let allottedCount = 0;

      for (const student of pendingStudents) {
        const targetRoom = availableRooms.find((rm) => rm.occupied < rm.capacity);
        if (targetRoom) {
          targetRoom.students.push(student.name);
          targetRoom.occupied += 1;
          await targetRoom.save();

          student.room = targetRoom.room;
          student.block = targetRoom.block;
          student.status = "allotted";
          await student.save();

          allottedCount += 1;
        }
      }

      return res.status(200).json({
        success: true,
        message: `Successfully allocated ${allottedCount} student(s) to rooms`,
        allottedCount,
      });
    } else {
      const store = getStore();
      let allottedCount = 0;

      store.students.forEach((student) => {
        if (student.status !== "pending") return;

        const targetRoom = store.rooms.find((rm) => !rm.maintenance && rm.occupied < rm.capacity);
        if (targetRoom) {
          targetRoom.students.push(student.name);
          targetRoom.occupied += 1;

          student.room = targetRoom.room;
          student.block = targetRoom.block;
          student.status = "allotted";
          allottedCount += 1;
        }
      });

      saveStore();
      return res.status(200).json({
        success: true,
        message: `Successfully allocated ${allottedCount} student(s) to rooms`,
        allottedCount,
      });
    }
  } catch (err) {
    next(err);
  }
}
