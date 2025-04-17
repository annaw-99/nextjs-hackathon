"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Trash, Users, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => router.push("/")}>← Back to Home</button>
      <h1 className="mt-4 text-2xl font-bold">Admin Dashboard</h1>
      {error && <p className="text-red-600">{error}</p>}

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Party</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waitlistData.map((entry) => (
            <TableRow key={entry.id} className="border-b border-gray-100">
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.phoneNumber}</TableCell>
              <TableCell>{entry.tableSize}</TableCell>
              <TableCell>{formatTime(entry.createdAt)}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatus(entry) === "waiting" ? "outline" : "secondary"}
                  className={
                    getStatus(entry) === "waiting"
                      ? "border-orange-200 text-orange-600"
                      : getStatus(entry) === "notified"
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "border-green-200 bg-green-50 text-green-600"
                  }
                >
                  {getStatus(entry)}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  disabled={entry.notified || entry.seated}
                  onClick={() => handleNotify(entry.id)}
                >
                  <Bell size={16} />
                </Button>
                <Button
                  size="sm"
                  disabled={entry.seated}
                  onClick={() => handleSeat(entry.id)}
                >
                  <Check size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(entry.id)}
                >
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Toaster />
    </div>
  );
}