import { useEffect, useState } from "react";

function NotificationBell({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/notifications/${user.id}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, [user]);

  function deleteNotification(id) {
    fetch(`http://localhost:3001/notifications/${id}`, {
      method: "DELETE"
    }).then(() => {
      setNotifications(notifications.filter(n => n.id !== id));
    });
  }

  if (!user) return null;

  return (
    <div style={{ position: "relative", marginLeft: "1rem" }}>
      <button
        onClick={() => setShowList(!showList)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          position: "relative"
        }}
        title="Notifications"
      >
        🔔
        {notifications.length > 0 && (
          <span style={{
            position: "absolute",
            top: "-0.5rem",
            right: "-0.5rem",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "0.25rem 0.5rem",
            fontSize: "0.75rem"
          }}>
            {notifications.length}
          </span>
        )}
      </button>

      {showList && (
        <div style={{
          position: "absolute",
          right: 0,
          background: "white",
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          padding: "1rem",
          borderRadius: "5px",
          zIndex: 10,
          width: "300px",
          maxHeight: "300px",
          overflowY: "auto"
        }}>
          {notifications.length === 0 ? (
            <p>Nu ai nici o notificare.</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "0.5rem" }}>
                <p>{n.message}</p>
                <small>{new Date(n.timestamp).toLocaleString()}</small>
                <button onClick={() => deleteNotification(n.id)} style={{ float: "right" }}>✖</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
