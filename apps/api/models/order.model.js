import { collection, doc, getDocs, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const ordersCollection = collection(db, 'orders');

export const findAll = async () => {
  const snapshot = await getDocs(ordersCollection);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const findById = async (id) => {
  const ref = doc(db, 'orders', id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const create = async (order) => {
  const docRef = await addDoc(ordersCollection, order);
  return { id: docRef.id, ...order };
};
