import * as orderModel from '../models/order.model.js';

export const listOrders = () => orderModel.findAll();

export const getOrderById = (id) => orderModel.findById(id);

export const createOrder = async ({ customerId, items }) => {
  const status = 'Draft';
  const totalAmount = items.reduce((acc, item) => acc + item.lineTotal, 0);
  const now = new Date().toISOString();

  const newOrder = {
    customerId,
    status,
    totalAmount,
    items,
    createdAt: now,
    updatedAt: now,
  };

  return orderModel.create(newOrder);
};
