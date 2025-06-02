const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all users (for admin dashboard)

router.get('/users', (req, res) => {
  const search = req.query.search || "";
  const users = db.prepare(`
    SELECT id, username, role FROM users
    WHERE username != 'Violeta' AND username LIKE ?
  `).all(`%${search}%`);

  res.json(users);
});

// Delete/ban a user by ID

router.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  try {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
    if (user && user.username === 'Violeta') {
      return res.status(403).json({ error: 'Cannot delete admin user' });
    }

    db.prepare(`DELETE FROM appointments WHERE user_id = ?`).run(id);
    db.prepare(`DELETE FROM requests WHERE user_id = ?`).run(id);
    db.prepare(`DELETE FROM notifications WHERE user_id = ?`).run(id);
    db.prepare(`DELETE FROM users WHERE id = ?`).run(id);

    res.json({ message: 'User and related data deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Get all appointment requests (pending or all)

router.get('/requests', (req, res) => {
  const requests = db.prepare(`
    SELECT r.id, r.type, r.status, r.appointment_id, r.user_id, u.username, a.day, a.hour
    FROM requests r
    JOIN users u ON r.user_id = u.id
    JOIN appointments a ON r.appointment_id = a.id
    ORDER BY r.id DESC
  `).all();

  res.json(requests);
});

// Approve or reject a request

router.post('/requests/:id/respond', (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body;

  const request = db.prepare(`SELECT * FROM requests WHERE id = ?`).get(requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  db.prepare(`UPDATE requests SET status = ? WHERE id = ?`).run(action, requestId);

  const userId = request.user_id;

  if (action === 'approve') {
    if (request.type === 'cancel') {
      // Delete requests referencing this appointment first
      db.prepare(`DELETE FROM requests WHERE appointment_id = ?`).run(request.appointment_id);
      // Then delete the appointment
      db.prepare(`DELETE FROM appointments WHERE id = ?`).run(request.appointment_id);
      // Notify user
      db.prepare(`
        INSERT INTO notifications (user_id, message)
        VALUES (?, ?)
      `).run(userId, 'Cererea dumneavoastra de anulare a fost aprobata!');
    }

    if (request.type === 'edit') {
      db.prepare(`DELETE FROM requests WHERE appointment_id = ?`).run(request.appointment_id);
      db.prepare(`
        INSERT INTO notifications (user_id, message)
        VALUES (?, ?)
      `).run(userId, 'Cererea dumneavoastra de schimbare a programarii a fost aprobata!');
    }
  }

  if (action === 'reject') {
    db.prepare(`
      INSERT INTO notifications (user_id, message)
      VALUES (?, ?)
    `).run(userId, `Cererea dvs de ${request.type} a fost respinsa.`);
  }

  res.json({ message: `Cererea dvs de ${action} a fost aprobata iar programarea a fost actualizata.` });
});

module.exports = router;
