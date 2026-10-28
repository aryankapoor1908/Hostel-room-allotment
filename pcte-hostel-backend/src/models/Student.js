import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    collegeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: String,
      default: "Block B",
    },
    room: {
      type: String,
      default: "Unassigned",
    },
    roomType: {
      type: String,
      default: "Double",
    },
    feeStatus: {
      type: String,
      enum: ["paid", "unpaid", "pending"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["allotted", "pending", "rejected"],
      default: "pending",
    },
    phone: {
      type: String,
      trim: true,
    },
    preferences: {
      hostelBlock: String,
      roomType: String,
      roommate: String,
      submitted: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
