import mongoose from "mongoose";

const messMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      unique: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    snacks: { type: String, required: true },
    dinner: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.MessMenu || mongoose.model("MessMenu", messMenuSchema);
