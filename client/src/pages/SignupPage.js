import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    if (password !== confirm) {
      return alert("Parolele nu corespund una cu alta.");
    }

    const res = await fetch("http://localhost:3001/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Cont creat cu succes!");
      navigate("/login");
    } else {
      alert(data.error || "Inregistrarea a dat gres.");
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <h2>Creaza un cont!</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Nume de utilizator"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Parola"
        required
      />
      <input
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        placeholder="Confirma parola"
        required
      />
      <button type="submit">Creeaza contul!</button>
    </form>
  );
}

export default SignupPage;
