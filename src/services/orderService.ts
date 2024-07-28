import { Order, IOrder } from '../models/Order';

const createOrder = async (orderData: IOrder) => {
  const existingOrder = await Order.findOne({
    email: orderData.email,
    user: orderData.user,
  });
  if (existingOrder) {
    throw new Error('Order already exists for this email and user');
  }
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
