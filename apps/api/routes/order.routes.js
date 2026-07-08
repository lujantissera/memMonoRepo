import { Router } from 'express';
import { getOrders, getOrder, createOrder } from '../controllers/orders.controller.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getOrders));
router.get('/:id', asyncHandler(getOrder));
router.post('/', asyncHandler(createOrder));

export default router;
