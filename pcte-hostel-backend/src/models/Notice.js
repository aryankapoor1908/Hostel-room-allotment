import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Urgent", "Event", "Maintenance", "General"],
      default: "General",
    },
    date: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Chief Hostel Warden",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
