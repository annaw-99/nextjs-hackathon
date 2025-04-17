"use client";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { Utensils, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { motion } from "framer-motion";

type Restaurant = {
  id: number;
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  cuisine: string;
  image: string;
};

type WaitlistEntry = {
  id: number;
  restaurantId: number;
  name: string;
  phoneNumber: string;
  tableSize: number;
  createdAt: string;
  notified: boolean;
};

export default function RestaurantDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableSize, setTableSize] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/restaurants/${id}`)
        .then((res) => res.json())
        .then(setRestaurant)
        .catch((err) => setError(err.message));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetch(`/api/waitlist?restaurantId=${id}&nocache=${Date.now()}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data: WaitlistEntry[]) => {
          setWaitlistEntries(data);
        })
        .catch((err) => {
          console.error("Error fetching waitlist", err);
          setError(err.message);
        });
    }
  }, [id]);

  const computedWaitTime = `${waitlistEntries.length * 12} min`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: Number(id),
          name,
          phoneNumber,
          tableSize,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await res.json();
      toast.success('Successfully joined the waitlist!');
      const updatedRes = await fetch(`/api/waitlist?restaurantId=${id}&nocache=${Date.now()}`);
      const updatedData: WaitlistEntry[] = await updatedRes.json();
      setWaitlistEntries(updatedData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen items-center justify-items-center p-8 bg-gradient-to-r from-indigo-50 to-white">
      {restaurant ? (
        <>
          <div className="w-full">
            <Link href="/restaurants" className="inline-flex items-center text-indigo-600 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <p className="text-sm font-bold">Back to Restaurants</p>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <div className="text-center relative z-10">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-md">
                <Utensils className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">{restaurant.name}</h1>
            <div className="mb-2 flex items-center justify-center gap-2 text-gray-600 text-sm font-bold">
              <span>{restaurant.cuisine}</span>
              <span>•</span>
              <span>Wait time: {computedWaitTime}</span>
            </div>
            <p className="mb-8 text-sm text-gray-800">
              Join the waitlist for {restaurant.name} and we'll notify you when your table is ready.
            </p>
            <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Name</Label>
                  <Input
                    type="text"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="phoneNumber" className="font-bold">Phone Number</Label>
                    <Input
                      type="text"
                      placeholder="000-000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="tableSize" className="font-bold">Table Size</Label>
                    <Input
                      type="number"
                      placeholder="Enter party size"
                      value={tableSize}
                      onChange={(e) => setTableSize(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold">
                  Join
                </Button>
              </form>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              There are currently <span className="text-indigo-600">{waitlistEntries.length}</span> parties on the waitlist for this restaurant.
            </p>
          </div>
          </motion.div>
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </>
      ) : (
        <p>Loading restaurant details...</p>
      )}
      <Toaster />
    </div>
  );
}
