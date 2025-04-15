import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { restaurantId, name, phoneNumber } = req.body;

      const entry = await prisma.waitlistEntry.create({
        data: {
          restaurantId: Number(restaurantId),
          name,
          phoneNumber,
        },
      });

      res.status(201).json(entry);
    } catch (error: any) {
      console.error('Error creating waitlist entry:', error);
      res.status(500).json({ error: 'Unable to add waitlist entry', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}