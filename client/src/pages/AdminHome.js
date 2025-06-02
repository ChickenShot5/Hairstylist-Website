import { useEffect, useState } from "react";

function AdminHome() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/appointments/all")
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);

  return (
    <div>
      <h2>Today's Appointments Overview</h2>

      {appointments.length === 0 && <p>No appointments yet.</p>}

      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            <strong>{app.username}</strong> - {app.day} at {app.hour}
            <br />
            <em>Status: {app.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminHome;
