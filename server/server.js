const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { connectDB } = require("./db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
