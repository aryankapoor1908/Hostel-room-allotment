import mongoose from "mongoose";

const marketplaceSchema = new mongoose.Schema(
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
    price: {
      type: String,
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Appliances", "Books", "Furniture", "Electronics", "Lost & Found", "Other"],
      default: "Other",
    },
    condition: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Marketplace || mongoose.model("Marketplace", marketplaceSchema);
