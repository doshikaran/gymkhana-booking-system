// src/app/(main)/history/page.tsx
"use client";

"use client";

import AuthGate from "@/components/AuthGate";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/auth.store";

type Booking = {
  id: string;
  court_id: number;
  start_time: string;
  end_time: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  created_by_life_no: string;
  other_member_life_nos: string[];
  created_at: string[];
  members: { member_id: string; role: string }[];
};

export default function HistoryPage() {
  return (
    <AuthGate>
      <Navbar />
      <HistoryInner />
    </AuthGate>
  );
}

function HistoryInner() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { sport } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bookings", tab, sport],
    queryFn: async () => {
      const { data } = await api.get(`/bookings?filter=${tab}&sport=${sport}`);
      return data as Booking[];
    },
    enabled: !!sport,
  });

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking deleted ✅");
      refetch();
    } catch (e: any) {
      const err = e?.response?.data?.detail;
      if (typeof err === "object" && err?.message) {
        toast.error(err.message);
      } else {
        toast.error(err || "Failed to delete booking");
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold tracking-widest">Your Bookings</h1>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          className={`py-2 rounded-xl uppercase tracking-wider text-sm font-bold ${
            tab === "upcoming" ? "bg-primary text-white" : "bg-white border"
          }`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`py-2 rounded-xl uppercase tracking-wider text-sm font-bold ${
            tab === "past" ? "bg-primary text-white" : "bg-white border"
          }`}
          onClick={() => setTab("past")}
        >
          Past
        </button>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-3">
          {data?.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="font-extrabold">Court {b.court_id}</div>
                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                  {b.status}
                </span>
              </div>

              <div className="text-sm text-gray-700 mt-2">
                <div>
                  {new Date(b.start_time).toLocaleString("en-IN", {
                    hour12: true,
                  })}{" "}
                  –{" "}
                  {new Date(b.end_time).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>

                <div className="mt-1 uppercase tracking-widest space-x-2">
                  <span className="font-bold">By:</span>
                  <span>{b.created_by_life_no}</span>
                </div>

                <div className="mt-1 uppercase tracking-widest space-x-2">
                  <span className="font-bold">Others:</span>
                  <span>{b.other_member_life_nos.join(", ")}</span>
                </div>
              </div>

              {/* 🗑️ Delete Button */}
              {tab === "upcoming" && (
                <button
                  onClick={() => handleDelete(b.id)}
                  className="mt-3 text-xs text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}

          {!data?.length && (
            <p className="text-sm text-gray-500">No {tab} bookings.</p>
          )}
        </div>
      )}
    </div>
  );
}
