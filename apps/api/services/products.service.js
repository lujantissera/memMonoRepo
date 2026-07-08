const { db } = require('../config/firebase');

const productsCollection = db.collection('products');

// listar todos los productos
const listProducts = async () => {
  const snapshot = await productsCollection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// obtener un producto por id
const getProductById = async (id) => {
  const doc = await productsCollection.doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

// crear un nuevo producto
const createProduct = async (product) => {
  const docRef = await productsCollection.add(product);
  return { id: docRef.id, ...product };
};

// actualizar un producto
const updateProduct = async (id, product) => {
  const docRef = productsCollection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  await docRef.set(product, { merge: true });
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
};

// eliminar un producto
const deleteProduct = async (id) => {
  const docRef = productsCollection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  await docRef.delete();
  return { id };
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
