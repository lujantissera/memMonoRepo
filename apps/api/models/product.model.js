import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

const productsCollection = collection(db, 'products');

export const findAll = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const findById = async (id) => {
  const ref = doc(db, 'products', id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const create = async (product) => {
  const docRef = await addDoc(productsCollection, product);
  return { id: docRef.id, ...product };
};

export const update = async (id, product) => {
  const ref = doc(db, 'products', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  await updateDoc(ref, product);
  return { id, ...product };
};

export const remove = async (id) => {
  const ref = doc(db, 'products', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  await deleteDoc(ref);
  return { id };
};
