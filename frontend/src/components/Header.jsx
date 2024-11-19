import logo from "../img/logo.svg"
import NewTaskForm from "./NewTaskForm";

function Header() {
  const handleLogout = () => {
    // Token aus LocalStorage entfernen
    localStorage.removeItem("jwt");

    // Seite aktualisieren oder auf die Login-Seite navigieren
    window.location.reload(); // Alternativ: Routing verwenden, z. B. React Router
  };
  return (
    <header>
      <div className="logo">
        <img src={logo} alt="To-Do App Logo" />
        <h1>To-Do App</h1>
      </div>
      <button onClick={handleLogout} className="logout-button">
       Logout
      </button>
      <NewTaskForm/>
    </header>
  );
}

export default Header;