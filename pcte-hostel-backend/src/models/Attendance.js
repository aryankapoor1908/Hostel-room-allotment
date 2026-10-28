import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      unique: true,
    },
    records: {
      type: Map,
      of: String, // collegeId -> "present" | "absent" | "leave"
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
