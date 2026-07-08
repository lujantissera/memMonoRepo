const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductPrice,
} = require('../controllers/products.controller');
const asyncHandler = require('../middlewares/asyncHandler');

router.get('/products', asyncHandler(getProducts));
router.get('/products/:id/price', asyncHandler(getProductPrice));
router.get('/products/:id', asyncHandler(getProduct));
router.post('/products', asyncHandler(createProduct));
router.put('/products/:id', asyncHandler(updateProduct));
router.delete('/products/:id', asyncHandler(deleteProduct));

module.exports = router;
