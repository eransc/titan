import { Router, Request, Response } from 'express';
import {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersByUser,
} from '../services/orderService';
import { IOrder } from '../models/Order';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post(
  '/orders',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('fullAddress').notEmpty().withMessage('Full address is required'),
    body('imageUrls').isArray().withMessage('Image URLs must be an array'),
    body('frame').notEmpty().withMessage('Frame is required'),
    body('color').notEmpty().withMessage('Color is required'),
    body('user').notEmpty().withMessage('User is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const orderData: IOrder = req.body;
      const order = await createOrder(orderData);
      res.status(201).json(order); // Return the created order JSON
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Order already exists for this email and user') {
          return res.status(409).json({ error: error.message }); // Conflict
        }
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  },
);

router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

router.get('/orders', async (_req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

router.get('/orders/user/:user', async (req: Request, res: Response) => {
  try {
    const user = req.params.user;
    const orders = await getOrdersByUser(user);
    res.json(orders);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

export default router;
