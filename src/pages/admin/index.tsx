"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Trash, Filter, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

type WaitlistEntry = {
  id: number;
  restaurantId: number;
  name: string;
  phoneNumber: string;
  createdAt: string;
  notified: boolean;
  tableSize: number;
};

const formatTime = (isoStr: string) => {
  const date = new Date(isoStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getStatus = (notified: boolean) => (notified ? "notified" : "waiting");

export default function AdminWaitlist() {
  const { data: session } = useSession();
  const restaurantId = session?.user.id;
  const router = useRouter();

  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [error, setError] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurantId?.toString() || "");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const res = await fetch(`/api/waitlist/${restaurantId}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data: WaitlistEntry[] = await res.json();
        setWaitlistData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    if (restaurantId) {
      fetchWaitlist();
    }
  }, [restaurantId]);

  const stats = {
    totalWaiting: waitlistData.filter((entry) => !entry.notified).length,
    totalNotified: waitlistData.filter((entry) => entry.notified).length,
    recentlySeated: waitlistData.filter((entry) => entry.notified).length,
  };

  const handleNotify = (id: number) => {
    setWaitlistData(
      waitlistData.map((entry) =>
        entry.id === id ? { ...entry, notified: true } : entry
      )
    );
    toast.success(`${waitlistData.find((entry) => entry.id === id)?.name} has been notified.`);
  };

  const handleSeat = (id: number) => {
    setWaitlistData(
      waitlistData.map((entry) =>
        entry.id === id ? { ...entry, notified: true } : entry
      )
    );
    toast.success(`${waitlistData.find((entry) => entry.id === id)?.name} has been seated.`);
  };

  const handleRemove = (id: number) => {
    setWaitlistData(waitlistData.filter((entry) => entry.id !== id));
    toast.success(`${waitlistData.find((entry) => entry.id === id)?.name} has been removed from the waitlist.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage restaurant waitlists and customer notifications</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Restaurant Waitlist</h2>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <p className="text-sm text-gray-500">{waitlistData.length} parties waiting</p>
              <Check className="h-4 w-4" />
              <p className="text-sm text-gray-500">{stats.totalNotified} parties seated</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-600">Name</TableHead>
                  <TableHead className="font-semibold text-gray-600">Phone</TableHead>
                  <TableHead className="font-semibold text-gray-600">Party Size</TableHead>
                  <TableHead className="font-semibold text-gray-600">Time</TableHead>
                  <TableHead className="font-semibold text-gray-600">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistData.map((entry) => (
                  <TableRow key={entry.id} className="border-b border-gray-100">
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{entry.phoneNumber}</TableCell>
                    <TableCell>{entry.tableSize}</TableCell>
                    <TableCell>
                      {new Date(entry.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatus(entry.notified) === "waiting" ? "outline" : "secondary"}
                        className={getStatus(entry.notified) === "waiting" 
                          ? "border-orange-200 font-bold text-orange-600" 
                          : "border-green-200 font-bold bg-green-50 text-green-600"}
                      >
                        {getStatus(entry.notified)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 ${
                            getStatus(entry.notified) === "notified" 
                              ? "text-blue-400 cursor-not-allowed" 
                              : "text-blue-600"
                          }`}
                          onClick={() => handleNotify(entry.id)}
                          disabled={getStatus(entry.notified) === "notified"}
                        >
                          <Bell className="h-4 w-4" />
                          <span className="sr-only">Notify</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleSeat(entry.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Seat</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRemove(entry.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
