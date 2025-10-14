// src/components/Booking/CourtTabs.tsx
"use client";

import { useAuthStore } from "@/store/auth.store";
import { useMemo } from "react";

type Props = {
  courts: { id: number; name: string }[];
  value: number | null;
  onChange: (id: number) => void;
};

// Define how many courts per sport
const SPORT_COURTS: Record<string, number> = {
  badminton: 2,
  tennis: 1,
  pickleball: 2,
  table_tennis: 3,
};

export default function CourtTabs({ courts, value, onChange }: Props) {
  const sport = useAuthStore((s) =>
    s.sport?.toLowerCase().replace(/\s+/g, "_")
  );

  const filteredCourts = useMemo(() => {
    const count = SPORT_COURTS[sport] ?? 1;
    return courts.slice(0, count).map((c, i) => ({
      ...c,
      name: `Court ${i + 1}`,
    }));
  }, [courts, sport]);

  return (
    <div className="flex gap-2">
      {filteredCourts.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`px-3 py-2 rounded-xl border tracking-widest ${
            value === c.id ? "bg-primary text-white" : "bg-white"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
