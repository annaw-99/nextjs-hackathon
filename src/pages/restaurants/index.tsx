import { useEffect, useState } from 'react';
import { Search, X, Clock } from 'lucide-react';
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

type Restaurant = {
  id: number;
  name: string;
  phone: string;
  description: string;
  address: string;
  city: string;
  state: string;
  cuisine: string;
  waitTime: string;
  image?: string;
};

const cuisineTypes = [
  "All",
  "Western",
  "Asian",
  "Italian",
  "Mediterranean",
  "Other"
];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('/api/restaurants');
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();
        setRestaurants(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="p-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-1 text-orange-500 text-center">EasiEats</h1>
        <p className="text-xs text-center text-gray-800">Find your next favorite restaurant. Join the waitlist to secure a table.</p>
        <div className="flex flex-col gap-4 md:flex-row m-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search restaurants or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-orange-200 focus-visible:border-orange-400 focus-visible:ring-transparent shadow-sm"
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
            <SelectTrigger className="w-full md:w-[180px] border-orange-200 focus:ring-orange-500">
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 m-12">
            {filteredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="gap-y-2 border-orange-200 transition-all hover:shadow-md p-4">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={restaurant.image || "/images/default-image.jpg"}
                    alt={restaurant.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full rounded-md"
                    priority={false}
                  />
                </div>
                <CardContent className="px-2 mt-0">
                  <h3 className="text-xl font-bold">{restaurant.name}</h3>
                  <div className="my-2 flex items-center justify-between">
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 font-bold">
                      {restaurant.cuisine}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.waitTime}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{restaurant.address}</div>
                  <div className="text-sm text-gray-600">{restaurant.city}, {restaurant.state}</div>
                  <p className="text-xs font-bold text-gray-600 mt-3">{restaurant.description}</p>
                </CardContent>
                <CardFooter className="px-2">
                  <Link href={`/restaurants/${restaurant.id}`} className="w-full">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 font-bold">
                      Join Waitlist
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
