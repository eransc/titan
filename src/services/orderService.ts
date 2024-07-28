import { Order, IOrder } from '../models/Order';

const createOrder = async (orderData: IOrder) => {
  const order = new Order(orderData);
  return await order.save();
};

const getOrderById = async (orderId: string) => {
  return await Order.findById(orderId);
};

const getAllOrders = async () => {
  return await Order.find();
};

const getOrdersByUser = async (user: string) => {
  return await Order.find({ user });
};

export { createOrder, getOrderById, getAllOrders, getOrdersByUser };
