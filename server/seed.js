// server/seed.js
const db = require("./db/database");
const bcrypt = require("bcrypt");

const checkAdmin = db
  .prepare(`SELECT * FROM users WHERE username = ?`)
  .get("Violeta");

if (!checkAdmin) {
  const hash = bcrypt.hashSync("violeta13", 10);
  db.prepare(
    `
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
  `
  ).run("Violeta", hash, "admin");
  console.log('Admin account "Violeta" created.');
}
