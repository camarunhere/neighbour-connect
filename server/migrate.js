const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "neighbour_connect",
});

const migrations = [
  { file: "001_create_posts_table.sql", label: "posts table" },
  { file: "002_create_users_table.sql", label: "users table" },
  { file: "003_add_image_url_to_posts.sql", label: "image_url column" },
];

db.connect((err) => {
  if (err) {
    console.error("Could not connect to MySQL:", err.message);
    process.exit(1);
  }

  console.log("Connected to MySQL. Running migrations...\n");

  let completed = 0;

  migrations.forEach(({ file, label }) => {
    const sql = fs.readFileSync(path.join(__dirname, "migrations", file), "utf8");

    db.query(sql, (err) => {
      if (err) {
        console.error(`✖ Failed [${label}]:`, err.message);
      } else {
        console.log(`✔ Done    [${label}]`);
      }

      completed++;
      if (completed === migrations.length) {
        console.log("\nAll migrations finished.");
        db.end();
      }
    });
  });
});
