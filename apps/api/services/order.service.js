let orders = [];
let OrderItems = [];

let nextOrderId = 1;
let nextOrderItemId = 1;

const listOrders = () => {
    return orders;
};

const getOrderById = (id) =>  {
    const order = orders.find(order => order.id === id);
    if (!order) {
        return null;
    }
    const items = OrderItems.filter(item => item.orderId === id);
    return { ...order, items };
};

const createOrder = ({ customerId, items }) => {
    const status = 'Draft';
    const totalAmount = items.reduce((acc, item) => acc + item.lineTotal, 0);

    const newOrder = {
        id: nextOrderId++,
        customerId,
        status,
        totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);

    const createdItems = items.map((item) => {
        const newItem = {
            id: nextOrderItemId++,
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
        };
        OrderItems.push(newItem);
        return newItem;
    });

    return { ...newOrder, items: createdItems };
};

module.exports = {
    listOrders,
    getOrderById,
    createOrder,
};