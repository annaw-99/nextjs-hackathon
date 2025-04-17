"use client";
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

type Restaurant = {
  id: number;
  name: string;
  phone: string;
  description: string;
  address: string;
  city: string;
  state: string;
  cuisine: string;
  image?: string;
  _count: {
    waitlist: number;
  };
};

const cuisineTypes = [
  "All",
  "East Asian",
  "South Asian",
  "European",
  "American",
  "Mexican/Latin"
];

const cityTypes = [
  "All",
  "San Francisco",
  "Los Angeles",
  "Seattle",
  "New York",
];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('/api/restaurants', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data: Restaurant[] = await res.json();
        setRestaurants(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === "" ||selectedCuisine === "All" ||restaurant.cuisine === selectedCuisine;
    const matchesCity = selectedCity === "" || selectedCity === "All" || restaurant.city === selectedCity;
    return matchesSearch && matchesCuisine && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <div className="relative w-full h-[450px]">
        <Image 
          src="/images/waiting.png" 
          alt="HUEY" 
          fill
          className="object-cover brightness-90"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center max-w-7xl mx-auto px-8 lg:px-12 2xl:px-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center text-center md:text-left">
            <Link href="/">
              <Image className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] w-[100px] md:w-[150px]" src="/images/logo.png" alt="HUEY" width={150} height={150} />
            </Link>
            <div className="space-y-2">
              <div className="space-y-2">
                <p className="text-2xl md:text-4xl font-bold text-indigo-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Find a spot.</p>
                <p className="text-2xl md:text-4xl font-bold text-indigo-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Hop in line.</p>
                <p className="text-lg md:text-4xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">...but like from your phone ;)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6 max-w-7xl mx-auto px-8 lg:px-12 2xl:px-16 pt-8">
        <div className="flex flex-col gap-4 md:flex-row lg:mx-12 bg-white/40 backdrop-blur-sm rounded-lg p-4 shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Look for a restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 focus-visible:border-indigo-400 focus-visible:ring-transparent shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <SelectTrigger className="cursor-pointer w-full md:w-[180px]">
              <SelectValue placeholder="Select Cuisine Type" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine} className="cursor-pointer">
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="cursor-pointer w-full md:w-[180px]">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {cityTypes.map((city) => (
                <SelectItem key={city} value={city} className="cursor-pointer">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {filteredRestaurants.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">
            <p>No restaurants found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:mx-12">
            {filteredRestaurants.map((restaurant) => {
              return (
                <Card key={restaurant.id} className="py-0 gap-y-1 group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <Image
                      src={restaurant.image || "/images/default-image.jpg"}
                      alt={restaurant.name}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">{restaurant.name}</h3>
                      <Badge variant="outline" className="mt-2 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                        {restaurant.cuisine}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="px-4 pb-2 space-y-2">
                    <p className="text-xs font-bold text-gray-600 mt-3">{restaurant.description}</p>
                    
                    <div className="space-y-4 py-3 border-y border-gray-100">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-900">{restaurant.address}</p>
                            <p className="text-xs text-gray-500">{restaurant.city}, {restaurant.state}</p>
                          </div>
                          <Button variant="outline" size="sm" className="cursor-pointer h-7 px-3 text-xs text-indigo-600 hover:text-indigo-700 border-indigo-200 hover:border-indigo-300"
                          onClick={() => {
                            const url = 'https://www.google.com/maps/place/Imaginary+Pl,+Aberdeen+Township,+NJ+07747/@40.3941899,-74.2220197,17z';
                            window.open(url, '_blank');
                          }}
                          >
                            Get Directions
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-xs text-gray-600">{restaurant.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/restaurants/${restaurant.id}`} className="w-full">
                      <Button className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors duration-200">
                        Join Waitlist
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <footer className="row-start-4 mt-8 py-2 flex items-center justify-center">
        <p className="text-gray-500 text-[10px]">© 2025 HUEY. All Rights Reserved.</p>
      </footer>
      </motion.div>
    </div>
  );
}

