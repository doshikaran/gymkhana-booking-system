// src/components/Booking/TimeGrid.tsx

"use client";

import { api } from "@/lib/api";
import { CLOSE_HOUR, OPEN_HOUR } from "@/lib/constants";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

type Props = {
  day: "today" | "tomorrow";
  courtId: number | null;
  value?: string; // selected slot ISO
  sport: string;
  onChange: (iso: string) => void;
};

export default function TimeGrid({
  day,
  courtId,
  value,
  sport,
  onChange,
}: Props) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate hourly slots between OPEN_HOUR and CLOSE_HOUR
  const slots = useMemo(() => {
    const base = new Date();
    if (day === "tomorrow") base.setDate(base.getDate() + 1);
    base.setSeconds(0, 0);

    const arr: string[] = [];
    for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
      const dt = new Date(base);
      dt.setHours(h, 0, 0, 0);
      arr.push(dt.toISOString());
    }
    return arr;
  }, [day]);

  // 📡 Fetch booked slots from backend
  useEffect(() => {
    if (!courtId || !sport) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        // ✅ Use the new availability endpoint
        const { data } = await api.get("/bookings/availability", {
          params: { court_id: courtId, date: day, sport },
        });

        type BookedSlot = { start_time: string };
        const booked = (data as BookedSlot[]).map((b) => b.start_time);
        setBookedSlots(booked);
      } catch (err) {
        console.error("Failed to fetch availability", err);
        setBookedSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [courtId, day, sport]);

  return (
    <div className="space-y-3">
      {/* 🎯 Time Slots Grid */}
      <div className="grid grid-cols-3 gap-2">
        {slots.map((iso) => {
          const label = new Date(iso).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          // ✅ Normalize both dates to compare properly
          const slotTime = new Date(iso).toISOString();
          const isBooked = bookedSlots.some((bookedSlot) => {
            // Compare ISO strings or timestamps
            return (
              new Date(bookedSlot).getTime() === new Date(slotTime).getTime()
            );
          });
          const isSelected = value === iso;

          return (
            <button
              key={iso}
              disabled={isBooked || loading}
              onClick={() => !isBooked && !loading && onChange(iso)}
              className={clsx(
                "rounded-xl border py-2 text-sm transition-all duration-150 font-medium",
                loading && "opacity-50 cursor-wait",
                isBooked
                  ? "bg-red-500 text-white border-red-500 cursor-not-allowed"
                  : isSelected
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 🟩🟥⬜ Legend */}
      <div className="flex justify-center gap-4 text-xs text-gray-600 mt-2">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500 border border-gray-300"></span>
          <span>Your selection</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500 border border-gray-300"></span>
          <span>Already booked</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-white border border-gray-300"></span>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}
