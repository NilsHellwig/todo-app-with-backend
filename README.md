# Full-Stack: Todo-App

## Installation


## Implementierungsschritte Frontend

1. Vite Projekt anlegen:

```bash
npm create vite@latest frontend -- --template react
```

2. Abhängigkeiten installieren:

```bash
npm install
```

3. Entwicklungsserver starten:

```bash
npm run dev
```

4. `src/assets`, `src/index.css`, `public/vite.svg` löschen

5. App.jsx anpassen:

```javascript
import './App.css'

function App() {

  return (
    <div>Hallo Welt</div>
  )
}

export default App
```

## Implementierungsschritte Backend

1. Init Node Environment

```bash
npm init
```

2. Packages installieren in `/backend`


```bash
npm install express body-parser cors nodemon mongoose
```

3. NPM starten

```bash
npm start
```