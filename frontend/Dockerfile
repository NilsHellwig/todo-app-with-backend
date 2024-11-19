# Verwende ein offizielles Node.js-Image
FROM node:18

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die package.json und package-lock.json
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest der Frontend-Dateien
COPY . .

# Exponiere den Standard-Entwicklungsport von Vite
EXPOSE 5173

# Starte den Vite-Entwicklungsserver
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
