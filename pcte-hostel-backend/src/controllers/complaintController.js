import Complaint from "../models/Complaint.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getAllComplaints(req, res, next) {
  try {
    const { collegeId, status, category } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (collegeId) filter.collegeId = new RegExp(`^${collegeId}$`, "i");
      if (status) filter.status = status;
      if (category) filter.category = category;

      const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: complaints });
    } else {
      const store = getStore();
      let list = [...store.complaints];
      if (collegeId) list = list.filter((c) => c.collegeId.toLowerCase() === collegeId.toLowerCase());
      if (status) list = list.filter((c) => c.status === status);
      if (category) list = list.filter((c) => c.category === category);

      return res.status(200).json({ success: true, data: list });
    }
  } catch (err) {
    next(err);
  }
}

export async function createComplaint(req, res, next) {
  try {
    const complaintData = req.body;
    const newComplaint = {
      id: "cmp_" + Date.now().toString().slice(-4),
      createdAt: new Date().toISOString(),
      status: "reported",
      technician: "Unassigned",
      ...complaintData,
    };

    if (isMongoConnected()) {
      const created = await Complaint.create(newComplaint);
      return res.status(201).json({ success: true, data: created });
    } else {
      const store = getStore();
      store.complaints.unshift(newComplaint);
      saveStore();
      return res.status(201).json({ success: true, data: newComplaint });
    }
  } catch (err) {
    next(err);
  }
}

export async function assignComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const { technicianName } = req.body;

    if (isMongoConnected()) {
      const complaint = await Complaint.findOneAndUpdate(
        { id },
        { technician: technicianName, status: "assigned" },
        { new: true }
      );
      if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found" });
      }
      return res.status(200).json({ success: true, data: complaint });
    } else {
      const store = getStore();
      const complaint = store.complaints.find((c) => c.id === id);
      if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found" });
      }
      complaint.technician = technicianName;
      complaint.status = "assigned";
      saveStore();
      return res.status(200).json({ success: true, data: complaint });
    }
  } catch (err) {
    next(err);
  }
}

export async function updateComplaintStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'reported' | 'assigned' | 'in_progress' | 'resolved'

    const updateFields = { status };
    if (status === "resolved") {
      updateFields.resolvedAt = new Date().toISOString();
    }

    if (isMongoConnected()) {
      const complaint = await Complaint.findOneAndUpdate({ id }, updateFields, { new: true });
      if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found" });
      }
      return res.status(200).json({ success: true, data: complaint });
    } else {
      const store = getStore();
      const complaint = store.complaints.find((c) => c.id === id);
      if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found" });
      }
      complaint.status = status;
      if (status === "resolved") {
        complaint.resolvedAt = new Date().toISOString();
      }
      saveStore();
      return res.status(200).json({ success: true, data: complaint });
    }
  } catch (err) {
    next(err);
  }
}
