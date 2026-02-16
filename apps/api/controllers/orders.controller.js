const { listOrders, getOrderById, createOrder: createOrderService } = require('../services/order.service');
const { getProductById } = require('../services/products.service');

// get all orders GET /orders
const getOrders = (req, res) => {
    const data = listOrders();
    res.status(200).json(data);
};

// get order by id GET /orders/:id
const getOrder = (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
    }
    const order = getOrderById(id);
    if (!order) {
        res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.status(200).json(order);
};

// create a new order POST /orders
const createOrder = (req, res) => {
    const { customerId, items } = req.body;
    if (!customerId || !items || items.length === 0) {
        res.status(400).json({ error: 'customerId y items son requeridos' });
    }
    if (!customerId || typeof customerId !== 'number') {
        res.status(400).json({ error: 'ID de cliente inválido' });
    }

    // validar que los items sean válidos + calcular precios
    const normalizedItems = [];
    for (const item of items) {
        const {productId, quantity} = item;
        if (!productId || typeof productId !== 'number') {
            res.status(400).json({ error: 'ID de producto inválido' });
        }
        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            res.status(400).json({ error: 'Cantidad inválida' });
        }
        const product = getProductById(productId);
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
        const unitPrice = product.price;
        const lineTotal = unitPrice * quantity;
        normalizedItems.push({ ...item, unitPrice, lineTotal });
    }
    const created = createOrderService({ customerId, items: normalizedItems });
    res.status(201).json(created);  
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
};