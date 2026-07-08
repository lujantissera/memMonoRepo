const express = require('express');
const router = express.Router();

const {
  getOrders,
  getOrder,
  createOrder,
} = require('../controllers/orders.controller');
const asyncHandler = require('../middlewares/asyncHandler');

router.get('/orders', asyncHandler(getOrders));
router.get('/orders/:id', asyncHandler(getOrder));
router.post('/orders', asyncHandler(createOrder));

module.exports = router;
