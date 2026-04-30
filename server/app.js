const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./api/auth/auth.routes");
const uploadRoutes = require("./api/upload/upload.routes");
const announcementsRoutes = require("./api/announcements/announcements.routes");
const lostFoundRoutes = require("./api/lost-found/lostFound.routes");
const eventsRoutes = require("./api/events/events.routes");
const { verifyToken } = require("./middleware/auth");

const app = express();

app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/upload", verifyToken, uploadRoutes);
app.use("/api/announcements", verifyToken, announcementsRoutes);
app.use("/api/lost-found", verifyToken, lostFoundRoutes);
app.use("/api/events", verifyToken, eventsRoutes);

module.exports = app;
