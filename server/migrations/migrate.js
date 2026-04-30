const fs = require("fs");
const path = require("path");
const db = require("../db");

const sqlFile = path.join(__dirname, "001_create_posts_table.sql");
const sql = fs.readFileSync(sqlFile, "utf8");

db.query(sql, (err) => {
  if (err) {
    console.error("Migration failed:", err);
  } else {
    console.log("Migration ran successfully.");
  }
  db.end();
});
