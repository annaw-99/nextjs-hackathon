import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id)

  if (req.method === 'PUT') {
    const { notified, seated } = req.body as {
      notified?: boolean
      seated?: boolean
    }

    try {
      const updated = await prisma.waitlistEntry.update({
        where: { id },
        data: {
          ...(notified !== undefined ? { notified } : {}),
          ...(seated  !== undefined ? { seated  } : {}),
        },
      })
      return res.status(200).json(updated)
    } catch (error: any) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to update entry', message: error.message })
    }
  }

  if (req.method === 'DELETE') {
    await prisma.waitlistEntry.delete({ where: { id } })
    return res.status(204).end()
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
