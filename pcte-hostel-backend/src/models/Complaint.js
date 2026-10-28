import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    student: {
      type: String,
      required: true,
    },
    collegeId: {
      type: String,
      required: true,
    },
    room: String,
    block: String,
    category: {
      type: String,
      enum: ["Electrical", "Plumbing", "Wi-Fi / Internet", "Carpentry", "Cleaning", "Other"],
      default: "Other",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["reported", "assigned", "in_progress", "resolved"],
      default: "reported",
    },
    technician: {
      type: String,
      default: "Unassigned",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
