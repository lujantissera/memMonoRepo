import * as productModel from '../models/product.model.js';

export const listProducts = () => productModel.findAll();

export const getProductById = (id) => productModel.findById(id);

export const createProduct = (product) => productModel.create(product);

export const updateProduct = (id, product) => productModel.update(id, product);

export const deleteProduct = (id) => productModel.remove(id);
