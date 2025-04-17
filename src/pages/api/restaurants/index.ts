import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        waitlist: {
          where: { seated: false },
          select: { id: true }
        }
      }
    })

    const payload = restaurants.map((r) => ({
      id:          r.id,
      name:        r.name,
      phone:       r.phone,
      description: r.description,
      address:     r.address,
      city:        r.city,
      state:       r.state,
      cuisine:     r.cuisine,
      image:       r.image,
      _count: {
        waitlist: r.waitlist.length
      }
    }))

    return res.status(200).json(payload)
  } catch (error: any) {
    console.error('Error fetching restaurants:', error)
    return res.status(500).json({ error: 'Failed to fetch restaurants', message: error.message })
  }
}