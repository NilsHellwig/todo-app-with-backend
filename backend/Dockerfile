# Backend Dockerfile

# Verwende ein offizielles Node.js-Image als Basis
FROM node:18

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

COPY package*.json ./

# Kopiere den Rest der Backend-Dateien
COPY . .

# Installiere die Abhängigkeiten
RUN npm install

# Exponiere den Port, auf dem der Server laufen wird
EXPOSE 3030

# Starte die Anwendung
CMD ["npm", "start"]
