// lib/db.js (safe to import)
import mongoose from "mongoose";

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in environment — skipping DB connect.");
    return; // or throw here if you prefer to fail hard at call-time
  }

  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri, {
    // options if needed
  });
}

export default connectDB;
