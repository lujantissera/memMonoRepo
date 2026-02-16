const express = require('express');
const router = express.Router();

const {
    getOrders,
    getOrder,
    createOrder,
} = require('../controllers/orders.controller');

router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.post('/orders', createOrder);

module.exports = router;