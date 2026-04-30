const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/neighbour_connect";

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
};

mongoose.connection.on("disconnected", () =>
  console.warn("MongoDB disconnected.")
);
mongoose.connection.on("error", (err) =>
  console.error("MongoDB error:", err.message)
);

module.exports = { connectDB, mongoose };
