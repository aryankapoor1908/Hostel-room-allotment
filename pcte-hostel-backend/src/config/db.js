import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pcte_hostel";

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`\x1b[32m✔ MongoDB connected successfully to:\x1b[0m ${mongoose.connection.host}/${mongoose.connection.name}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`\x1b[33m⚠ MongoDB connection unavailable:\x1b[0m ${err.message}`);
    console.warn(`\x1b[36mℹ Switching to embedded JSON storage mode (data/local_db.json) for zero-downtime operation.\x1b[0m`);
    console.warn(`\x1b[90mTip: Start local MongoDB or provide an Atlas connection string in .env (MONGODB_URI) to use real MongoDB.\x1b[0m\n`);
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
