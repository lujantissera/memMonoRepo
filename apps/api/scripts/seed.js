import 'dotenv/config';
import * as productModel from '../models/product.model.js';

const sampleProducts = [
  { name: 'sillon 1', price: 100, color: 'rojo' },
  { name: 'sillon 2', price: 200, color: 'azul' },
  { name: 'sillon 3', price: 300, color: 'verde' },
];

const seed = async () => {
  for (const product of sampleProducts) {
    const created = await productModel.create(product);
    console.log(`Producto creado: ${created.id} - ${product.name}`);
  }

  console.log('Seed completado.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Error al seedear datos:', err);
  process.exit(1);
});
