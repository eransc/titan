import { Schema, model, Document } from 'mongoose';

interface IOrder extends Document {
  email: string;
  fullName: string;
  fullAddress: string;
  imageUrls: string[];
  frame: string;
  color: string;
  user: string;
}

const orderSchema = new Schema<IOrder>({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  imageUrls: { type: [String], required: true },
  frame: { type: String, required: true },
  color: { type: String, required: true },
  user: { type: String, required: true },
});

const Order = model<IOrder>('Order', orderSchema);

export { Order, IOrder };
