import { useState, useEffect } from "react";
import { loginUser, registerUser } from "../api";

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Zustand für Registrierung
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hilfsfunktion: Überprüfen, ob der JWT abgelaufen ist
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now(); // Vergleich von Ablaufzeit und aktuellem Datum
    } catch (e) {
      return true; // Wenn der Token ungültig ist
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && !isTokenExpired(token)) {
      setIsLoggedIn(true);
      onLogin(token); // Automatisch einloggen
    } else if (token) {
      localStorage.removeItem("jwt"); // Abgelaufenen Token entfernen
    }
  }, [onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(username, password);
      if (response.token) {
        localStorage.setItem("jwt", response.token); // JWT speichern
        onLogin(response.token); // JWT übergeben
        setIsLoggedIn(true);
      } else {
        setError("Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.");
      }
    } catch (err) {
      setError("Es gab einen Fehler beim Login.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await registerUser(username, password);
      if (response.token) {
        localStorage.setItem("jwt", response.token); // JWT speichern
        onLogin(response.token); // JWT übergeben
        setIsLoggedIn(true);
      } else {
        setError("Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben.");
      }
    } catch (err) {
      setError("Es gab einen Fehler bei der Registrierung.");
    }
  };

  return (
    <div className="login-screen">
      <h1>{isRegistering ? "Registrieren" : "Login"} - Todo App</h1>
      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="login-form">
        <label>Benutzername:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Passwort:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="black-button">
          {isRegistering ? "Registrieren" : "Einloggen"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>{isRegistering ? "Bereits ein Konto erstellt?" : "Noch kein Konto erstellt?"}</p>
      <button onClick={() => setIsRegistering(!isRegistering)} className="black-button">
        {isRegistering ? "Zum Login" : "Jetzt registrieren"}
      </button>
    </div>
  );
}

export default LoginScreen;
