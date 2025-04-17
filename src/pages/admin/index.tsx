"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Trash, Users, LogOut, Pencil, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

type WaitlistEntry = {
  id: number;
  restaurantId: number;
  name: string;
  phoneNumber: string;
  createdAt: string;
  notified: boolean;
  tableSize: number;
  seated: boolean;
};

const formatTime = (isoStr: string) =>
  new Date(isoStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const getStatus = (entry: WaitlistEntry) => {
  if (entry.seated) return "seated";
  if (entry.notified) return "notified";
  return "waiting";
};

export default function AdminWaitlist() {
  const { data: session } = useSession();
  const restaurantId = session?.user.id!;
  const router = useRouter();

  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!restaurantId) return;
    const url = `/api/waitlist?restaurantId=${restaurantId}&includeSeated=true`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setWaitlistData)
      .catch((err) => setError(err.message));
  }, [restaurantId]);

  async function handleNotify(id: number) {
    try {
      const res = await fetch(`/api/waitlist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notified: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: WaitlistEntry = await res.json();
      setWaitlistData((list) => list.map((e) => (e.id === id ? updated : e)));
      toast.success(`${updated.name} has been notified`);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleSeat(id: number) {
    try {
      const res = await fetch(`/api/waitlist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seated: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: WaitlistEntry = await res.json();
      setWaitlistData((list) => list.map((e) => (e.id === id ? updated : e)));
      toast.success(`Party seated`);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleRemove(id: number) {
    try {
      const res = await fetch(`/api/waitlist/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setWaitlistData((list) => list.filter((e) => e.id !== id));
      toast.success(`Entry removed`);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col space-y-6 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Waitlist Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="cursor-pointer flex bg-red-500 text-white font-bold hover:bg-red-600 hover:text-white"
                onClick={() => router.refresh()}>
                <RefreshCcw className="h-4 w-4" />Refresh
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer flex bg-indigo-600 text-white font-bold hover:bg-indigo-700 hover:text-white">
                <Pencil className="h-4 w-4" />Edit Profile
              </Button>
              <Button
              variant="outline"
              className="cursor-pointer flex bg-white/50 text-gray-700 font-bold hover:bg-gray-100"
              onClick={() => router.push("/auth/owner")}>
              <LogOut className="h-4 w-4" />Logout
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="px-6 py-4">
              <p className="text-sm font-bold text-gray-600">Waiting</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {waitlistData.filter(e => !e.notified && !e.seated).length}
              </p>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm font-bold text-gray-600">Notified</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {waitlistData.filter(e => e.notified && !e.seated).length}
              </p>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm font-bold text-gray-600">Seated</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {waitlistData.filter(e => e.seated).length}
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="py-3 pl-6 font-bold text-gray-500">Guest Name</TableHead>
                <TableHead className="py-3 font-bold text-gray-500">Contact</TableHead>
                <TableHead className="py-3 font-bold text-gray-500">Table Size</TableHead>
                <TableHead className="py-3 font-bold text-gray-500">Added to Waitlist At</TableHead>
                <TableHead className="py-3 font-bold text-gray-500">Status</TableHead>
                <TableHead className="py-3 pr-6 text-right font-bold text-gray-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlistData.map((entry) => (
                <TableRow 
                  key={entry.id} 
                  className="font-bold group hover:bg-gray-50/50 transition-colors duration-150"
                >
                  <TableCell className="py-3 pl-6">
                    <div className="text-gray-900">{entry.name}</div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-gray-600">{entry.phoneNumber}</div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{entry.tableSize}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-gray-600">{formatTime(entry.createdAt)}</div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={
                        getStatus(entry) === "waiting"
                          ? "font-bold bg-orange-50 text-orange-700 border-orange-200"
                          : getStatus(entry) === "notified"
                          ? "font-bold bg-blue-50 text-blue-700 border-blue-200"
                          : "font-bold bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {getStatus(entry)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 pr-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        disabled={entry.notified || entry.seated}
                        onClick={() => handleNotify(entry.id)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                        disabled={entry.seated}
                        onClick={() => handleSeat(entry.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        onClick={() => handleRemove(entry.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Toaster />
    </div>
  );
}