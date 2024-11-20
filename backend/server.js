const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3030;
const JWT_SECRET = "supersecretkey"; // Verwende in Produktion eine sichere Methode

// Middleware
app.use(cors());
app.use(bodyParser.json());

const url = "mongodb://localhost:27017/todo-app";

// MongoDB Verbindung
mongoose.connect(url, { useUnifiedTopology: true })
  .then(() => console.log("MongoDB verbunden"))
  .catch((err) => console.error("MongoDB Fehler:", err));

// Mongoose Modelle
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);

// Middleware zur Authentifizierung
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token erforderlich" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Ungültiger Token" });
  }
};

// Routen
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Benutzername und Passwort erforderlich" });
  }

  try {
    // Neuen Benutzer erstellen und speichern
    const user = new User({ username, password });
    await user.save();

    // Token erstellen
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);

    // Antwort mit Erfolgsmeldung und Token
    res.status(201).json({ message: "Nutzer registriert", token });
  } catch (err) {
    res.status(400).json({ error: "Fehler bei der Registrierung" });
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.status(401).json({ error: "Ungültige Anmeldedaten" });

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
  res.json({ token });
});

app.get("/tasks", authenticate, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

app.post("/tasks", authenticate, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Task-Text erforderlich" });

  const task = new Task({ text, userId: req.user.id });
  await task.save();
  res.status(201).json(task);
});

app.delete("/tasks/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ error: "Task nicht gefunden" });
    }
    res.status(200).json({ message: "Task erfolgreich gelöscht" });
  } catch (err) {
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});


// In der PUT-Route
app.put("/tasks/:id", authenticate, async (req, res) => {
  const { id } = req.params; // Extrahiere die ID aus den Routen-Parametern
  const { text } = req.body;

  // Überprüfe, ob die ID ein gültiges MongoDB ObjectId-Format hat
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Ungültige ID" });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { text },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task nicht gefunden" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Serverfehler", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
