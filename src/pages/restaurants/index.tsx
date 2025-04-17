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

const stateTypes = [
  "All",
  "California",
  "Washington",
  "New York",
];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');

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
    const matchesState = selectedState === "" || selectedState === "All" || restaurant.state === selectedState;
    return matchesSearch && matchesCuisine && matchesCity && matchesState;
  });

  return (
    <div className="p-8 bg-gradient-to-r from-indigo-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <div className="space-y-6">
        <Link href="/" className="text-5xl font-bold mb-1 text-indigo-500 flex justify-center">
          HUEY
        </Link>
        <p className="text-sm text-center font-bold text-gray-800">
          HAVE U EATEN YET?
        </p>
        <div className="flex flex-col gap-4 md:flex-row mx-12 bg-white rounded-lg p-4 shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-indigo-200 focus-visible:border-indigo-400 focus-visible:ring-transparent shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <SelectTrigger className="cursor-pointer w-full md:w-[180px] border-indigo-200 focus:ring-indigo-500">
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
            <SelectTrigger className="cursor-pointer w-full md:w-[180px] border-indigo-200 focus:ring-indigo-500">
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
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="cursor-pointer w-full md:w-[180px] border-indigo-200 focus:ring-indigo-500">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {stateTypes.map((state) => (
                <SelectItem key={state} value={state} className="cursor-pointer">
                  {state}
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-12">
            {filteredRestaurants.map((restaurant) => {
              const waitTime = restaurant._count.waitlist * 12;
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
                    <div className="flex flex-col text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Estimated Wait Time</span>
                        <span className="text-gray-800 font-semibold">{waitTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Parties Waiting</span>
                        <span className="text-gray-800 font-semibold">{restaurant._count.waitlist}</span>
                      </div>
                    </div>
                    <div className="pt-1 border-t border-gray-100">
                      <div className="text-sm">
                        <div className="text-gray-600 text-xs mt-1">
                          {restaurant.address}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {restaurant.city}, {restaurant.state}
                        </div>
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
      <footer className="row-start-4 mt-8 flex items-center justify-center">
        <p className="text-[10px]">© 2025 HUEY. All Rights Reserved.</p>
      </footer>
      </motion.div>
    </div>
  );
}
