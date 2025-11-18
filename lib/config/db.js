// db.js
import mongoose from "mongoose";
console.log("🔍 MONGO_URI value at runtime:", process.env.MONGO_URI);
console.log("🧩 typeof MONGO_URI:", typeof process.env.MONGO_URI);

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI not set in environment");
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri, {
    // useNewUrlParser: true, useUnifiedTopology: true  // options if needed
  });
}

export default connectDB;
