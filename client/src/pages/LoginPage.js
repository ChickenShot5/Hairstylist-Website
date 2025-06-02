import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert(data.error);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Intra in cont!</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nume de utilizator"
      />
      <input
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Parola"
      />
      <button type="submit">Logheaza-te!</button>
    </form>
  );
}

export default LoginPage;
