import { useEffect, useState, useCallback } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(() => {
    fetch(`http://localhost:3001/admin/users?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [searchTerm]);

  const fetchRequests = useCallback(() => {
    fetch("http://localhost:3001/admin/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, [fetchUsers, fetchRequests]);

  function handleSearch(e) {
    e.preventDefault();
    fetchUsers();
  }

  function deleteUser(id) {
    if (!window.confirm("Are you sure you want to ban this user?")) return;
    fetch(`http://localhost:3001/admin/users/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert("User deleted");
      });
  }

  function respondToRequest(id, action) {
    fetch(`http://localhost:3001/admin/requests/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        alert(data.message || `Request ${action}d`);
      });
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Cauta utilizatori..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Cauta</button>
      </form>

      <h2>All Users</h2>
      {users.length === 0 && <p>Nu ai nici un utilizator inca.</p>}
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} ({u.role}){" "}
            <button onClick={() => deleteUser(u.id)}>Baneaza</button>
          </li>
        ))}
      </ul>

      <hr />

      <h2>Appointment Requests</h2>
      {requests.length === 0 && <p>Nu ai inca nici o cerere.</p>}
      <ul>
        {requests.map((req) => (
          <li key={req.id}>
            <strong>{req.username}</strong> a cerut sa {" "}
            <strong>{req.type}</strong> programare pe {req.day} la ora {req.hour}
            <br />
            <button onClick={() => respondToRequest(req.id, "approve")}>
              Aproba
            </button>
            <button onClick={() => respondToRequest(req.id, "reject")}>
              Respinge
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
