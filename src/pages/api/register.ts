import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    restaurantName, 
    phoneNumber, 
    description, 
    address, 
    city, 
    state, 
    email, 
    password, 
    confirmPassword 
  } = req.body;

  if (!email || !password || !confirmPassword || !restaurantName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'owner',
      },
    });

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        phone: phoneNumber,
        description,
        address,
        city,
        state,
        cuisine: "All",
        image: "/images/default-image.jpg"
      },
    });

    res.status(201).json({ 
      message: 'Registration successful',
      user: newUser, 
      restaurant: newRestaurant
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
