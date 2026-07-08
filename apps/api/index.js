require('dotenv').config();

const express = require('express');
const healthRoutes = require('./routes/healt.routes');
const orderRoutes = require('./routes/order.routes');
const productsRoutes = require('./routes/products.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// rutas
app.use(healthRoutes);
app.use(productsRoutes);
app.use(orderRoutes);

// ruta raíz para probar que el servidor responde
app.get('/', (req, res) => {
  res.send('API OK. Prueba /health');
});

app.use(notFoundHandler);
app.use(errorHandler);

// en Vercel el servidor corre como función serverless: no hay que hacer listen(),
// Vercel invoca `app` directamente como handler de cada request.
if (!process.env.VERCEL) {
  const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`API running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Error al iniciar el servidor:', err);
  });
}

module.exports = app;
