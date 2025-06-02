import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserHome from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import MakeAppointment from "./pages/MakeAppointment";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminHome />
              ) : (
                <UserHome />
              )
            ) : (
              <UserHome />
            )
          }
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <UserDashboard user={user} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<h2>404 - Not Found</h2>} />
        <Route
          path="/make"
          element={
            user && user.role === "user" ? (
              <MakeAppointment user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <footer>
        <p>
          <strong>VioSalon</strong> – Studio de coafură profesională
        </p>
        <p>
          <strong>Adresă:</strong> Str. Florilor 12, București
        </p>
        <p>
          <strong>Program:</strong> Luni – Vineri: 09:00 – 18:00 | Sâmbătă:
          10:00 – 14:00
        </p>
        <p>
          <strong>Telefon:</strong> 0723 456 789
        </p>
        <p>
          <strong>Email:</strong> violeta@hairstudio.com
        </p>
      </footer>
    </Router>
  );
}

export default App;
