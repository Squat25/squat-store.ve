// Script para normalizar las claves de los estados en agencias-mrw.json
// Ejecuta: node src/data/normaliza-mrw.js

const fs = require("fs");
const path = require("path");

// Mapeo de claves originales (mayúsculas, sin tildes) a claves normalizadas
const estadosMap = {
  AMAZONAS: "Amazonas",
  ANZOATEGUI: "Anzoátegui",
  APURE: "Apure",
  ARAGUA: "Aragua",
  BARINAS: "Barinas",
  BOLIVAR: "Bolívar",
  CARABOBO: "Carabobo",
  COJEDES: "Cojedes",
  "DELTA AMACURO": "Delta Amacuro",
  "DISTRITO CAPITAL": "Distrito Capital",
  FALCON: "Falcón",
  GUARICO: "Guárico",
  LARA: "Lara",
  MERIDA: "Mérida",
  MIRANDA: "Miranda",
  MONAGAS: "Monagas",
  "NUEVA ESPARTA": "Nueva Esparta",
  PORTUGUESA: "Portuguesa",
  SUCRE: "Sucre",
  TACHIRA: "Táchira",
  TRUJILLO: "Trujillo",
  "LA GUAIRA": "La Guaira",
  YARACUY: "Yaracuy",
  ZULIA: "Zulia",
};

const filePath = path.join(__dirname, "agencias-mrw.json");
const raw = fs.readFileSync(filePath, "utf8");
const data = JSON.parse(raw);

const normalizado = {};
for (const key in data) {
  const normal = estadosMap[key.trim().toUpperCase()];
  if (normal) {
    normalizado[normal] = data[key];
  } else {
    // Si no está en el mapeo, lo deja igual (por si acaso)
    normalizado[key] = data[key];
  }
}

fs.writeFileSync(filePath, JSON.stringify(normalizado, null, 2), "utf8");
console.log("¡Listo! El archivo agencias-mrw.json fue normalizado.");
