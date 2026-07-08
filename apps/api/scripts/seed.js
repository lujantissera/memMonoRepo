require('dotenv').config();
const { db } = require('../config/firebase');

const sampleProducts = [
  { name: 'sillon 1', price: 100, color: 'rojo' },
  { name: 'sillon 2', price: 200, color: 'azul' },
  { name: 'sillon 3', price: 300, color: 'verde' },
];

const seed = async () => {
  const productsCollection = db.collection('products');

  for (const product of sampleProducts) {
    const docRef = await productsCollection.add(product);
    console.log(`Producto creado: ${docRef.id} - ${product.name}`);
  }

  console.log('Seed completado.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Error al seedear datos:', err);
  process.exit(1);
});
