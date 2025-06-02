import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar({ user }) {
  return (
    <nav>
      <Link to="/">VioSalon</Link>
      {user ? (
        <>
          <Link to="/dashboard">Cont</Link>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Delogheaza-te
          </button>
        </>
      ) : (
        <>
          <Link to="/signup">Inregistreaza-te!</Link>
          <Link to="/login">Intra in cont!</Link>
        </>
      )}
      {user && <NotificationBell user={user} />}
    </nav>
  );
}

export default Navbar;
