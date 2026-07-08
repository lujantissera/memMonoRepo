import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import healthRoutes from './routes/healt.routes.js';
import orderRoutes from './routes/order.routes.js';
import productsRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// rutas
app.use(healthRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/auth', authRoutes);

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

export default app;
