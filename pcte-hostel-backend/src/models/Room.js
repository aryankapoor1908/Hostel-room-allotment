import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    block: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
      default: 1,
    },
    type: {
      type: String,
      enum: ["Single", "Double", "Triple"],
      default: "Double",
    },
    capacity: {
      type: Number,
      required: true,
      default: 2,
    },
    occupied: {
      type: Number,
      default: 0,
    },
    students: {
      type: [String],
      default: [],
    },
    maintenance: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
