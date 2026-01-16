// ============================================
// IMPORTACIONES
// ============================================
const config = require('./config/config');
require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { logMensaje } = require("./utils/logger.js");
const PORT = config.port;

// Rutas de la API
const campañasRoutes = require("./routes/campañaRoutes.js");
const donacionesRoutes = require("./routes/donacionRoutes.js");

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express();
const port = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE - PARSEO
// ============================================
app.use(express.json());

// ============================================
// MIDDLEWARE - CORS - Cualquier origen
// ============================================
app.use(cors());

// ============================================
// MIDDLEWARE - ARCHIVOS ESTÁTICOS
// ============================================
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// RUTAS - API REST
// ============================================
app.use("/api/campanas", campañasRoutes);
app.use("/api/donaciones", donacionesRoutes);

// ============================================
// RUTAS - SPA (Catch-all)
// ============================================
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// ============================================
// SERVIDOR
// ============================================
app.listen(PORT, () => {
  logMensaje(`Servidor escuchando en el puerto ${PORT}`);
});
