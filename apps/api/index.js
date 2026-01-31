const express = require('express');
const healthRoutes = require('./routes/health.routes');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// rutas
app.use(healthRoutes);

// ruta raíz para probar que el servidor responde
app.get('/', (req, res) => {
  res.send('API OK. Prueba /health');
});

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Error al iniciar el servidor:', err);
});
