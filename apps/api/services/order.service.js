const { db } = require('../config/firebase');

const ordersCollection = db.collection('orders');

const listOrders = async () => {
  const snapshot = await ordersCollection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getOrderById = async (id) => {
  const doc = await ordersCollection.doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

const createOrder = async ({ customerId, items }) => {
  const status = 'Draft';
  const totalAmount = items.reduce((acc, item) => acc + item.lineTotal, 0);
  const now = new Date().toISOString();

  const newOrder = {
    customerId,
    status,
    totalAmount,
    items,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await ordersCollection.add(newOrder);
  return { id: docRef.id, ...newOrder };
};

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
};
