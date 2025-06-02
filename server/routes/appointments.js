const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Create new appointment (user)

router.post('/create', (req, res) => {
  const { user_id, username, day, hour } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO appointments (user_id, username, day, hour)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(user_id, username, day, hour);
    res.status(201).json({ message: 'Programare creata cu succes!' });
  } catch (err) {
    res.status(400).json({ error: 'Eroare in creerea programarii.' });
  }
});

// Get appointments for user

router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  const appointments = db.prepare(`
    SELECT * FROM appointments WHERE user_id = ?
  `).all(userId);

  res.json(appointments);
});

// Get all appointments (admin)

router.get('/all', (req, res) => {
  const appointments = db.prepare(`
    SELECT * FROM appointments
  `).all();

  res.json(appointments);
});

// Admin: update appointment

router.patch('/:id', (req, res) => {
  const { day, hour, status } = req.body;
  const id = req.params.id;

  const stmt = db.prepare(`
    UPDATE appointments SET day = ?, hour = ?, status = ? WHERE id = ?
  `);
  stmt.run(day, hour, status, id);

  res.json({ message: 'Programare actualizata.' });
});

// Admin: delete appointment

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
  res.json({ message: 'Programare stearsa' });
});

// User: request cancel or edit

router.post('/request-cancel', (req, res) => {
  const { appointment_id, user_id, type } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO requests (appointment_id, user_id, type)
      VALUES (?, ?, ?)
    `);
    stmt.run(appointment_id, user_id, type);

    res.status(201).json({ message: 'Cerere trimisa' });
  } catch (err) {
    res.status(400).json({ error: 'Nu s-a putut crea cererea.' });
  }
});

module.exports = router;
