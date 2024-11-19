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

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // JWT entfernen
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (isLoggedIn) {
    return (
      <div className="login-screen">
        <h1>Willkommen!</h1>
        <p>Du bist eingeloggt.</p>
        <button onClick={handleLogout}>Ausloggen</button>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <h1>{isRegistering ? "Registrieren" : "Login"}</h1>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Benutzername:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Passwort:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isRegistering ? "Registrieren" : "Einloggen"}</button>
      </form>
      <p>
        {isRegistering ? (
          <>
            Bereits ein Konto?{" "}
            <button onClick={() => setIsRegistering(false)}>Zum Login</button>
          </>
        ) : (
          <>
            Noch kein Konto?{" "}
            <button onClick={() => setIsRegistering(true)}>Jetzt registrieren</button>
          </>
        )}
      </p>
    </div>
  );
}

export default LoginScreen;
