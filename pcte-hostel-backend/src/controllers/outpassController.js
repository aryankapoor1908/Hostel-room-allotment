import Outpass from "../models/Outpass.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getAllOutpasses(req, res, next) {
  try {
    const { collegeId, status } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (collegeId) filter.collegeId = new RegExp(`^${collegeId}$`, "i");
      if (status) filter.status = status;

      const outpasses = await Outpass.find(filter).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: outpasses });
    } else {
      const store = getStore();
      let list = [...store.outpasses];
      if (collegeId) list = list.filter((o) => o.collegeId.toLowerCase() === collegeId.toLowerCase());
      if (status) list = list.filter((o) => o.status === status);

      return res.status(200).json({ success: true, data: list });
    }
  } catch (err) {
    next(err);
  }
}

export async function createOutpass(req, res, next) {
  try {
    const outpassData = req.body;
    const newOutpass = {
      id: "out_" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
      approvedBy: null,
      ...outpassData,
    };

    if (isMongoConnected()) {
      const created = await Outpass.create(newOutpass);
      return res.status(201).json({ success: true, data: created });
    } else {
      const store = getStore();
      store.outpasses.unshift(newOutpass);
      saveStore();
      return res.status(201).json({ success: true, data: newOutpass });
    }
  } catch (err) {
    next(err);
  }
}

export async function resolveOutpass(req, res, next) {
  try {
    const { id } = req.params;
    const { decision, approvedBy = "Chief Hostel Warden" } = req.body;

    if (isMongoConnected()) {
      const outpass = await Outpass.findOneAndUpdate(
        { id },
        { status: decision, approvedBy: decision === "approved" ? approvedBy : null },
        { new: true }
      );
      if (!outpass) {
        return res.status(404).json({ success: false, message: "Outpass not found" });
      }
      return res.status(200).json({ success: true, data: outpass });
    } else {
      const store = getStore();
      const outpass = store.outpasses.find((o) => o.id === id);
      if (!outpass) {
        return res.status(404).json({ success: false, message: "Outpass not found" });
      }
      outpass.status = decision;
      outpass.approvedBy = decision === "approved" ? approvedBy : null;
      saveStore();
      return res.status(200).json({ success: true, data: outpass });
    }
  } catch (err) {
    next(err);
  }
}

export async function checkInOutpass(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. 'checked_out' or 'returned'

    if (isMongoConnected()) {
      const outpass = await Outpass.findOneAndUpdate({ id }, { status }, { new: true });
      if (!outpass) {
        return res.status(404).json({ success: false, message: "Outpass not found" });
      }
      return res.status(200).json({ success: true, data: outpass });
    } else {
      const store = getStore();
      const outpass = store.outpasses.find((o) => o.id === id);
      if (!outpass) {
        return res.status(404).json({ success: false, message: "Outpass not found" });
      }
      outpass.status = status;
      saveStore();
      return res.status(200).json({ success: true, data: outpass });
    }
  } catch (err) {
    next(err);
  }
}
