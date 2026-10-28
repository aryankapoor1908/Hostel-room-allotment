import Notice from "../models/Notice.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getAllNotices(req, res, next) {
  try {
    if (isMongoConnected()) {
      const notices = await Notice.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: notices });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, data: store.notices });
    }
  } catch (err) {
    next(err);
  }
}

export async function createNotice(req, res, next) {
  try {
    const noticeData = req.body;
    const newNotice = {
      id: "not_" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      author: noticeData.author || "Hostel Administration",
      ...noticeData,
    };

    if (isMongoConnected()) {
      const created = await Notice.create(newNotice);
      return res.status(201).json({ success: true, data: created });
    } else {
      const store = getStore();
      store.notices.unshift(newNotice);
      saveStore();
      return res.status(201).json({ success: true, data: newNotice });
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteNotice(req, res, next) {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await Notice.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Notice not found" });
      }
      return res.status(200).json({ success: true, message: "Notice deleted successfully" });
    } else {
      const store = getStore();
      const index = store.notices.findIndex((n) => n.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Notice not found" });
      }
      store.notices.splice(index, 1);
      saveStore();
      return res.status(200).json({ success: true, message: "Notice deleted successfully" });
    }
  } catch (err) {
    next(err);
  }
}
