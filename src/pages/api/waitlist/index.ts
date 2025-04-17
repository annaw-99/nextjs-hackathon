import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { restaurantId, includeSeated } = req.query
  if (req.method === 'GET') {
    const includeAll = includeSeated === 'true'
    try {
      const entries = await prisma.waitlistEntry.findMany({
        where: {
          restaurantId: Number(restaurantId),
          ...(includeAll ? {} : { seated: false }),
        },
        orderBy: { createdAt: 'asc' },
      })
      return res.status(200).json(entries)
    } catch (error: any) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch waitlist entries', message: error.message })
    }
  }

  if (req.method === 'POST') {
    const { restaurantId, name, phoneNumber, tableSize } = req.body
    try {
      const entry = await prisma.waitlistEntry.create({
        data: { restaurantId, name, phoneNumber, tableSize },
      })
      return res.status(201).json(entry)
    } catch (error: any) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to create waitlist entry', message: error.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
