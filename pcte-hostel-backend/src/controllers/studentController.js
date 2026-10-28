import Student from "../models/Student.js";
import Room from "../models/Room.js";
import Request from "../models/Request.js";
import Receipt from "../models/Receipt.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getAllStudents(req, res, next) {
  try {
    if (isMongoConnected()) {
      const students = await Student.find().lean();
      return res.status(200).json({ success: true, data: students });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, data: store.students });
    }
  } catch (err) {
    next(err);
  }
}

export async function addStudent(req, res, next) {
  try {
    const studentData = req.body;
    if (!studentData.name || !studentData.collegeId) {
      return res.status(400).json({ success: false, message: "Name and College ID are required" });
    }

    if (isMongoConnected()) {
      const existing = await Student.findOne({ collegeId: studentData.collegeId });
      if (existing) {
        return res.status(409).json({ success: false, message: "Student with this College ID already exists" });
      }

      const newStudent = await Student.create(studentData);

      // If assigned to a specific room, update the room occupants
      if (studentData.room && studentData.room !== "Unassigned") {
        await Room.findOneAndUpdate(
          { room: new RegExp(`^${studentData.room.trim()}$`, "i") },
          { $addToSet: { students: studentData.name }, $inc: { occupied: 1 } }
        );
      }

      return res.status(201).json({ success: true, data: newStudent });
    } else {
      const store = getStore();
      const existing = store.students.some((s) => s.collegeId.toLowerCase() === studentData.collegeId.toLowerCase());
      if (existing) {
        return res.status(409).json({ success: false, message: "Student with this College ID already exists" });
      }

      store.students.unshift(studentData);

      if (studentData.room && studentData.room !== "Unassigned") {
        const room = store.rooms.find((r) => r.room.toLowerCase() === studentData.room.trim().toLowerCase());
        if (room && !room.students.includes(studentData.name)) {
          room.students.push(studentData.name);
          room.occupied = room.students.length;
        }
      }

      saveStore();
      return res.status(201).json({ success: true, data: studentData });
    }
  } catch (err) {
    next(err);
  }
}

export async function cycleFeeStatus(req, res, next) {
  try {
    const { collegeId } = req.params;

    if (isMongoConnected()) {
      const student = await Student.findOne({ collegeId: new RegExp(`^${collegeId}$`, "i") });
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      student.feeStatus = student.feeStatus === "paid" ? "unpaid" : student.feeStatus === "unpaid" ? "pending" : "paid";
      await student.save();

      return res.status(200).json({ success: true, data: student });
    } else {
      const store = getStore();
      const student = store.students.find((s) => s.collegeId.toLowerCase() === collegeId.toLowerCase());
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      student.feeStatus = student.feeStatus === "paid" ? "unpaid" : student.feeStatus === "unpaid" ? "pending" : "paid";
      saveStore();

      return res.status(200).json({ success: true, data: student });
    }
  } catch (err) {
    next(err);
  }
}

export async function submitPreferences(req, res, next) {
  try {
    const { collegeId } = req.params;
    const prefs = req.body;

    if (isMongoConnected()) {
      const student = await Student.findOneAndUpdate(
        { collegeId: new RegExp(`^${collegeId}$`, "i") },
        { preferences: { ...prefs, submitted: true } },
        { new: true }
      );
      return res.status(200).json({ success: true, data: student });
    } else {
      const store = getStore();
      store.studentPreferences[collegeId] = { ...prefs, submitted: true };
      const student = store.students.find((s) => s.collegeId.toLowerCase() === collegeId.toLowerCase());
      if (student) {
        student.preferences = { ...prefs, submitted: true };
      }
      saveStore();
      return res.status(200).json({ success: true, data: store.studentPreferences[collegeId] });
    }
  } catch (err) {
    next(err);
  }
}

export async function payFee(req, res, next) {
  try {
    const { collegeId } = req.params;
    const { amount = "₹60,000", installment = "1st Installment", method = "UPI" } = req.body;

    const txnId = "PCTE-" + Math.floor(100000 + Math.random() * 900000);
    const receiptData = {
      txnId,
      collegeId,
      date: new Date().toISOString(),
      amount,
      installment,
      paymentMethod: method,
    };

    if (isMongoConnected()) {
      await Student.findOneAndUpdate(
        { collegeId: new RegExp(`^${collegeId}$`, "i") },
        { feeStatus: "paid" }
      );

      const receipt = await Receipt.create(receiptData);
      return res.status(201).json({ success: true, data: receipt, message: "Payment successful" });
    } else {
      const store = getStore();
      const student = store.students.find((s) => s.collegeId.toLowerCase() === collegeId.toLowerCase());
      if (student) {
        student.feeStatus = "paid";
      }
      store.receipts.unshift(receiptData);
      saveStore();

      return res.status(201).json({ success: true, data: receiptData, message: "Payment successful" });
    }
  } catch (err) {
    next(err);
  }
}

export async function getReceipts(req, res, next) {
  try {
    const { collegeId } = req.query;

    if (isMongoConnected()) {
      const filter = collegeId ? { collegeId: new RegExp(`^${collegeId}$`, "i") } : {};
      const receipts = await Receipt.find(filter).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: receipts });
    } else {
      const store = getStore();
      let list = store.receipts || [];
      if (collegeId) {
        list = list.filter((r) => r.collegeId.toLowerCase() === collegeId.toLowerCase());
      }
      return res.status(200).json({ success: true, data: list });
    }
  } catch (err) {
    next(err);
  }
}

export async function getAllRequests(req, res, next) {
  try {
    if (isMongoConnected()) {
      const requests = await Request.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: requests });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, data: store.requests });
    }
  } catch (err) {
    next(err);
  }
}

export async function requestRoomChange(req, res, next) {
  try {
    const { studentName, collegeId, fromRoom, toRoom, reason } = req.body;
    const newRequest = {
      id: "req_" + Date.now(),
      student: studentName,
      collegeId,
      from: fromRoom,
      to: toRoom,
      reason,
      status: "pending",
    };

    if (isMongoConnected()) {
      const created = await Request.create(newRequest);
      return res.status(201).json({ success: true, data: created });
    } else {
      const store = getStore();
      store.requests.unshift(newRequest);
      saveStore();
      return res.status(201).json({ success: true, data: newRequest });
    }
  } catch (err) {
    next(err);
  }
}

export async function resolveRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { decision } = req.body; // 'approved' | 'rejected'

    if (isMongoConnected()) {
      const targetReq = await Request.findOne({ id });
      if (!targetReq) {
        return res.status(404).json({ success: false, message: "Request not found" });
      }

      targetReq.status = decision;
      await targetReq.save();

      if (decision === "approved") {
        const student = await Student.findOne({
          $or: [
            { collegeId: targetReq.collegeId },
            { name: new RegExp(`^${targetReq.student}$`, "i") },
          ],
        });

        const targetRoomObj = await Room.findOne({ room: new RegExp(`^${targetReq.to}$`, "i") });

        if (student) {
          student.room = targetReq.to;
          if (targetRoomObj) student.block = targetRoomObj.block;
          await student.save();
        }

        // Remove from old room
        await Room.findOneAndUpdate(
          { room: new RegExp(`^${targetReq.from}$`, "i") },
          { $pull: { students: targetReq.student }, $inc: { occupied: -1 } }
        );

        // Add to new room
        await Room.findOneAndUpdate(
          { room: new RegExp(`^${targetReq.to}$`, "i") },
          { $addToSet: { students: targetReq.student }, $inc: { occupied: 1 } }
        );
      }

      return res.status(200).json({ success: true, data: targetReq });
    } else {
      const store = getStore();
      const targetReq = store.requests.find((r) => r.id === id);
      if (!targetReq) {
        return res.status(404).json({ success: false, message: "Request not found" });
      }

      targetReq.status = decision;

      if (decision === "approved") {
        const student = store.students.find(
          (s) => s.collegeId === targetReq.collegeId || s.name.toLowerCase() === targetReq.student.toLowerCase()
        );
        const targetRoomObj = store.rooms.find((rm) => rm.room.toLowerCase() === targetReq.to.toLowerCase());

        if (student) {
          student.room = targetReq.to;
          if (targetRoomObj) student.block = targetRoomObj.block;
        }

        const oldRoom = store.rooms.find((rm) => rm.room.toLowerCase() === targetReq.from.toLowerCase());
        if (oldRoom) {
          oldRoom.students = oldRoom.students.filter((name) => name.toLowerCase() !== targetReq.student.toLowerCase());
          oldRoom.occupied = oldRoom.students.length;
        }

        const newRoom = store.rooms.find((rm) => rm.room.toLowerCase() === targetReq.to.toLowerCase());
        if (newRoom) {
          if (!newRoom.students.includes(targetReq.student)) {
            newRoom.students.push(targetReq.student);
          }
          newRoom.occupied = newRoom.students.length;
        }
      }

      saveStore();
      return res.status(200).json({ success: true, data: targetReq });
    }
  } catch (err) {
    next(err);
  }
}
