import { useEffect, useState } from "react";

function UserDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/appointments/user/${user.id}`)
      .then(res => res.json())
      .then(data => setAppointments(data));

    fetch(`http://localhost:3001/notifications/${user.id}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, [user.id]);

  function requestChange(id, type) {
    fetch(`http://localhost:3001/appointments/request-cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: id,
        user_id: user.id,
        type,
      }),
    })
      .then(res => res.json())
      .then(data => alert(data.message || "Request sent"));
  }

  function deleteNotification(id) {
    fetch(`http://localhost:3001/notifications/${id}`, {
      method: "DELETE",
    }).then(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    });
  }

  return (
    <div>
      <h2>Programarile tale</h2>
      {appointments.length === 0 && <p>Nu ai inca nici o programare.</p>}
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            {app.day} at {app.hour} — <em>Status: {app.status}</em>
            <br />
            <button onClick={() => requestChange(app.id, "cancel")}>Solicita anularea programarii</button>
            <button onClick={() => requestChange(app.id, "edit")}>Solicita o schimbare</button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Notificari</h3>
      {notifications.length === 0 && <p>Nu ai inca nici o notificare.</p>}
      <ul>
        {notifications.map(n => (
          <li key={n.id}>
            {n.message} ({new Date(n.timestamp).toLocaleString()})
            <button onClick={() => deleteNotification(n.id)}>✖</button>
          </li>
        ))}
      </ul>

      <button onClick={() => window.location.href = "/"}>Inapoi pe pagina principala / Programari</button>
    </div>
  );
}

export default UserDashboard;
