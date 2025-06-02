import { useNavigate } from "react-router-dom";

function UserHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to Violeta's Hair Studio 💇‍♀️</h1>

      <section className="business-card">
        <img
          src="/violeta.jpg"
          alt="Violeta"
          style={{ width: "150px", borderRadius: "50%" }}
        />
        <h2>Violeta</h2>
        <p>
          Sunt o coafeză cu peste 30 de ani de experiență în domeniu, dedicată artei frumuseții și îngrijirii părului. Specializată în vopsirea profesională, tunsori de precizie și transformări complete de look, am lucrat in tot acest timp la prestigiosul Salon Abbate, unde am format relații de încredere cu sute de cliente. Profesionalismul, creativitatea și atenția la detalii mă definesc. Programează-te acum și descoperă frumusețea unui păr îngrijit de mâini cu adevărat experimentate!
        </p>
        <p>
          <strong>Contact:</strong> violeta@hairstudio.com
        </p>
      </section>

      {user && user.role === "user" && (
        <button onClick={() => navigate("/make")}>Fa o programare</button>
      )}

      {!user && (
        <p style={{ marginTop: "1rem" }}>
          <em>Inregistreaza-te pentru a putea face o programare!</em>
        </p>
      )}
    </div>
  );
}

export default UserHome;
