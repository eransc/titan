import { Router, Request, Response } from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = Router();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const CACHE_TTL = 60 * 60; // Cache Time-to-Live in seconds (1 hour)

const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: CACHE_TTL * 0.2,
});

router.get('/images/:count', async (req: Request, res: Response) => {
  const count = parseInt(req.params.count);

  if (isNaN(count) || count <= 0) {
    return res
      .status(400)
      .send({
        error: 'Invalid count parameter. It must be a positive number.',
      });
  }

  const cacheKey = `images-${count}`;
  const cachedImages = cache.get(cacheKey);

  if (cachedImages) {
    return res.send(cachedImages);
  }

  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        count: count,
      },
    });

    const imageUrls = response.data.map((image: any) => image.urls.small);
    cache.set(cacheKey, imageUrls);

    res.send(imageUrls);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error message:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      res.status(500).send({ error: 'Failed to fetch images from Unsplash.' });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).send({ error: 'An unexpected error occurred.' });
    }
  }
});

export default router;
