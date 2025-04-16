import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { restaurantId } = req.query;
    try {
      const entries = await prisma.waitlistEntry.findMany({
        where: {
          restaurantId: Number(restaurantId)
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
      res.status(200).json(entries);
    } catch (error: any) {
      console.error('Error retrieving waitlist entries:', error);
      res.status(500).json({ error: 'Failed to fetch waitlist entries', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}