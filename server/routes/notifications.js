const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get notifications for a user

router.get('/:userId', (req, res) => {
  const userId = req.params.userId;

  const notifications = db.prepare(`
    SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC
  `).all(userId);

  res.json(notifications);
});

// Create a new notification

router.post('/create', (req, res) => {
  const { user_id, message } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO notifications (user_id, message)
      VALUES (?, ?)
    `);
    stmt.run(user_id, message);
    res.status(201).json({ message: 'Notificare creata cu succes' });
  } catch (err) {
    res.status(400).json({ error: 'Nu s-a putut crea notificarea' });
  }
});

// Mark notification as read (or delete it)

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.prepare('DELETE FROM notifications WHERE id = ?').run(id);
  res.json({ message: 'Notificare stearsa' });
});

module.exports = router;
