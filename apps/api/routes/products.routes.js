import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductPrice,
} from '../controllers/products.controller.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', asyncHandler(getProducts));
router.get('/:id/price', asyncHandler(getProductPrice));
router.get('/:id', asyncHandler(getProduct));
router.post('/create', authMiddleware, asyncHandler(createProduct));
router.put('/:id', authMiddleware, asyncHandler(updateProduct));
router.delete('/:id', authMiddleware, asyncHandler(deleteProduct));

export default router;
