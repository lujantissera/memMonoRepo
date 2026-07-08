const { listOrders, getOrderById, createOrder: createOrderService } = require('../services/order.service');
const { getProductById } = require('../services/products.service');
const ApiError = require('../utils/apiError');

// get all orders GET /orders
const getOrders = async (req, res) => {
  const data = await listOrders();
  res.status(200).json(data);
};

// get order by id GET /orders/:id
const getOrder = async (req, res) => {
  const { id } = req.params;
  const order = await getOrderById(id);
  if (!order) {
    throw new ApiError(404, 'Orden no encontrada');
  }
  res.status(200).json(order);
};

// create a new order POST /orders
const createOrder = async (req, res) => {
  const { customerId, items } = req.body;
  if (!customerId || !items || items.length === 0) {
    throw new ApiError(400, 'customerId y items son requeridos');
  }

  // validar que los items sean válidos + calcular precios
  const normalizedItems = [];
  for (const item of items) {
    const { productId, quantity } = item;
    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      throw new ApiError(400, 'productId y quantity (numérico > 0) son requeridos en cada item');
    }
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(404, `Producto no encontrado: ${productId}`);
    }
    const unitPrice = product.price;
    const lineTotal = unitPrice * quantity;
    normalizedItems.push({ ...item, unitPrice, lineTotal });
  }

  const created = await createOrderService({ customerId, items: normalizedItems });
  res.status(201).json(created);
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
};
