import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MakeAppointment({ user }) {
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3001/appointments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        username: user.username,
        day,
        hour,
      }),
    })
      .then(res => res.json())
      .then(data => {
        alert("Appointment booked!");
        navigate("/dashboard");
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fa o noua programare</h2>
      <label>
        Zi:
        <input
          type="date"
          value={day}
          onChange={e => setDay(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Ora:
        <input
          type="time"
          value={hour}
          onChange={e => setHour(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Confirma programarea</button>
    </form>
  );
}

export default MakeAppointment;
