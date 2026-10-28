import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      required: true,
      unique: true,
    },
    collegeId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: String,
      required: true,
    },
    installment: {
      type: String,
      default: "1st Installment",
    },
    paymentMethod: {
      type: String,
      default: "UPI",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
