import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const restaurants = await prisma.restaurant.findMany({
        include: {
          _count: {
            select: {
              waitlist: true,
            },
          },
        },
      });
      res.status(200).json(restaurants);
    } catch (error: any) {
      console.error('Error retrieving restaurants:', error);
      res.status(500).json({ error: 'Failed to fetch restaurants', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
