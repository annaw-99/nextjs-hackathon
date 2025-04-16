import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { restaurantId, name, phoneNumber, tableSize } = req.body;
    try {
      const created = await prisma.waitlistEntry.create({
        data: {
          restaurantId,
          name,
          phoneNumber,
          tableSize,
        },
      });
      return res.status(201).json(created);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create entry', message: err.message });
    }
  }

  res.status(405).end(`Method ${req.method} Not Allowed`);
}