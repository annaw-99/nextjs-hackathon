import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ error: 'Restaurant not found' });
      }
    } catch (error: any) {
      console.error('Error retrieving restaurant:', error);
      res.status(500).json({ error: 'Failed to fetch restaurant', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}