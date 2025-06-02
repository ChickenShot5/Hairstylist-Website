const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
    stmt.run(username, hash, 'user');
    res.status(201).json({ message: 'Utilizator creat cu succes!' });
  } catch (err) {
    res.status(400).json({ error: 'Utilizatorul exista deja.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ message: 'Ati intrat in cont cu succes.', user });
  } else {
    res.status(401).json({ error: 'Credentiale gresite.' });
  }
});

module.exports = router;
