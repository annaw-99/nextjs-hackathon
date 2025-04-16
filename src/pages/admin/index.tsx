"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Search, X, Bell, Check, Trash, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

type WaitlistEntry = {
  id: number;
  restaurantId: number;
  name: string;
  phoneNumber: string;
  createdAt: string;
  notified: boolean;
};

const formatTime = (isoStr: string) => {
  const date = new Date(isoStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getStatus = (notified: boolean) => (notified ? "notified" : "waiting");

export default function AdminWaitlist() {
  const { data: session } = useSession();
  const restaurantId = session?.user.id;

  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredWaitlist = waitlistData.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || getStatus(entry.notified) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalWaiting: waitlistData.filter((entry) => !entry.notified).length,
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
    <div className="p-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-4 mx-12">
      <h1 className="text-2xl font-bold">Welcome Back!</h1>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-500">Waiting</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalWaiting}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-500">Seated</span>
          </div>
          <p className="text-2xl font-bold">{stats.recentlySeated}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row m-12">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-orange-400" />
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-orange-200 focus-visible:ring-orange-500 shadow-sm"
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
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] border-orange-200 focus:ring-orange-500 shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="notified">Notified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-orange-100 shadow-sm overflow-hidden m-12">
        <Table>
          <TableHeader className="bg-orange-50">
            <TableRow>
              <TableHead className="w-[200px] px-4 font-bold">Customer</TableHead>
              <TableHead className="text-center font-bold">Joined</TableHead>
              <TableHead className="text-center font-bold">Table Size</TableHead>
              <TableHead className="text-center font-bold">Status</TableHead>
              <TableHead className="text-right px-10 font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWaitlist.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No customers found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredWaitlist.map((entry) => (
                <TableRow key={entry.id} className={entry.notified ? "opacity-60" : ""}>
                  <TableCell className="px-4">
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-gray-500">{entry.phoneNumber}</div>
                  </TableCell>
                  <TableCell className="text-center">{formatTime(entry.createdAt)}</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">
                    {getStatus(entry.notified) === "waiting" ? (
                      <Badge variant="outline" className="font-bold text-orange-600 border-orange-200">
                        Waiting
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-bold text-blue-600 border-blue-200">
                        Notified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleNotify(entry.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between m-12">
        <div className="text-sm text-gray-500">
          Showing {filteredWaitlist.length} of {waitlistData.length} customers
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-orange-200" disabled>
            Previous
          </Button>
          <Button size="sm" variant="outline" className="border-orange-200" disabled>
            Next
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
