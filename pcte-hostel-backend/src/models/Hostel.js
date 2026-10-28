import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rooms: {
      type: Number,
      required: true,
      default: 15,
    },
    occupied: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Hostel || mongoose.model("Hostel", hostelSchema);
