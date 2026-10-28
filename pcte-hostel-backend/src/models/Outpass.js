import mongoose from "mongoose";

const outpassSchema = new mongoose.Schema(
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
    type: {
      type: String,
      default: "Day Outing",
    },
    purpose: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    expectedReturn: {
      type: String,
      required: true,
    },
    parentContact: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "checked_out", "returned"],
      default: "pending",
    },
    approvedBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Outpass || mongoose.model("Outpass", outpassSchema);
