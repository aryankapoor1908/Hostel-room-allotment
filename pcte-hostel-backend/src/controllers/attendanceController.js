import Attendance from "../models/Attendance.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getAttendance(req, res, next) {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];

    if (isMongoConnected()) {
      const record = await Attendance.findOne({ date: targetDate }).lean();
      return res.status(200).json({
        success: true,
        date: targetDate,
        data: record ? Object.fromEntries(record.records) : {},
      });
    } else {
      const store = getStore();
      const records = (store.attendance && store.attendance[targetDate]) || {};
      return res.status(200).json({
        success: true,
        date: targetDate,
        data: records,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function markAttendance(req, res, next) {
  try {
    const { date, collegeId, status } = req.body;
    if (!date || !collegeId || !status) {
      return res.status(400).json({ success: false, message: "Date, collegeId, and status are required" });
    }

    if (isMongoConnected()) {
      let doc = await Attendance.findOne({ date });
      if (!doc) {
        doc = new Attendance({ date, records: new Map() });
      }
      doc.records.set(collegeId, status);
      await doc.save();

      return res.status(200).json({ success: true, date, records: Object.fromEntries(doc.records) });
    } else {
      const store = getStore();
      if (!store.attendance) store.attendance = {};
      if (!store.attendance[date]) store.attendance[date] = {};

      store.attendance[date][collegeId] = status;
      saveStore();

      return res.status(200).json({ success: true, date, records: store.attendance[date] });
    }
  } catch (err) {
    next(err);
  }
}

export async function bulkMarkAttendance(req, res, next) {
  try {
    const { date, statusMap } = req.body;
    if (!date || !statusMap) {
      return res.status(400).json({ success: false, message: "Date and statusMap are required" });
    }

    if (isMongoConnected()) {
      let doc = await Attendance.findOne({ date });
      if (!doc) {
        doc = new Attendance({ date, records: new Map() });
      }

      Object.entries(statusMap).forEach(([k, v]) => {
        doc.records.set(k, v);
      });

      await doc.save();
      return res.status(200).json({ success: true, date, records: Object.fromEntries(doc.records) });
    } else {
      const store = getStore();
      if (!store.attendance) store.attendance = {};
      store.attendance[date] = {
        ...(store.attendance[date] || {}),
        ...statusMap,
      };
      saveStore();

      return res.status(200).json({ success: true, date, records: store.attendance[date] });
    }
  } catch (err) {
    next(err);
  }
}
