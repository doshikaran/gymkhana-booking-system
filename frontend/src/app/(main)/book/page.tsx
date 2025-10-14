/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(main)/book/page.tsx
"use client";

import AuthGate from "@/components/AuthGate";
import CourtTabs from "@/components/Booking/CourtTabs";
import DateToggle from "@/components/Booking/DateToggle";
import MemberInputs from "@/components/Booking/MemberInputs";
import TimeGrid from "@/components/Booking/TimeGrid";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import { useCourts } from "@/hooks/useCourts";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function BookPage() {
  return (
    <AuthGate>
      <Navbar />
      <BookInner />
    </AuthGate>
  );
}

function BookInner() {
  const { data: courts } = useCourts();
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const [courtId, setCourtId] = useState<number | null>(null);
  const [startIso, setStartIso] = useState<string | undefined>();
  const [members, setMembers] = useState<string[]>([]);
  const user = useAuthStore((s) => s.user);
  const sport = useAuthStore((s) => s.sport);

  const limits: Record<string, { min: number; max: number }> = {
    badminton: { min: 3, max: 7 }, // user + 3–7 others = total 4–8
    pickleball: { min: 1, max: 5 }, // user + 1–5 = total 2–6
    tennis: { min: 1, max: 3 }, // user + 1–3 = total 2–4
    table_tennis: { min: 1, max: 5 }, // user + 1–5 = total 2–6
  };

  useEffect(() => {
    if (courts && courts.length && courtId === null) setCourtId(courts[0].id);
  }, [courts, courtId]);

  const endIso = useMemo(() => {
    if (!startIso) return undefined;
    const d = new Date(startIso);
    d.setHours(d.getHours() + 1);
    return d.toISOString();
  }, [startIso]);

  const onSubmit = async () => {
    try {
      if (!courtId || !startIso || !endIso)
        return toast.error("Select court and time");

      const compact = members.map((m) => m.trim()).filter(Boolean);

      const rule = limits[sport?.toLowerCase() || "badminton"];
      if (compact.length < rule.min || compact.length > rule.max) {
        return toast.error(
          `${sport?.toUpperCase() || "BADMINTON"} requires ${rule.min + 1}–${
            rule.max + 1
          } total players (including you).`
        );
      }

      if (
        user?.life_membership_no &&
        compact.includes(user.life_membership_no)
      ) {
        return toast.error("You cannot include yourself as another member.");
      }

      const payload = {
        court_id: courtId,
        start_time: startIso,
        end_time: endIso,
        duration: 60,
        member_nos: compact,
        sport,
      };
      await api.post("/bookings", payload);
      toast.success("Booked ✅");
      setStartIso(undefined);
      setMembers([]);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail?.message || "Booking failed");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="font-semibold tracking-wider">Book your Court</h1>
      <DateToggle value={day} onChange={setDay} />
      <div className="space-y-2">
        <p className="text-sm text-gray-700 tracking-wider">
          Choose your court
        </p>
        {courts ? (
          <CourtTabs
            courts={courts}
            value={courtId ?? 0}
            onChange={setCourtId}
          />
        ) : (
          <p>Loading courts…</p>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-700 tracking-wider">
          Choose your time slot
        </p>
        <TimeGrid
          day={day}
          courtId={courtId}
          value={startIso}
          sport={sport}
          onChange={setStartIso}
        />
      </div>
      <MemberInputs values={members} onChange={setMembers} />
      <Button onClick={onSubmit}>Confirm Booking</Button>
      <p className="text-xs text-gray-600">
        {(() => {
          const key = sport?.toLowerCase() || "badminton";
          const rule = limits[key] || { min: 3, max: 7 };
          return (
            <>
              Rules for {sport || "Badminton"}: total {rule.min + 1}–
              {rule.max + 1} players (including you).
            </>
          );
        })()}
      </p>
    </div>
  );
}
