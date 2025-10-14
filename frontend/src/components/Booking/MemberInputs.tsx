// src/components/Booking/MemberInputs.tsx

"use client";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useMemo, useState } from "react";

type Props = {
  values: string[];
  onChange: (vals: string[]) => void;
};

// Sport-based limits for *other* members only
const LIMITS: Record<string, { min: number; max: number }> = {
  badminton: { min: 3, max: 7 }, // total 4–8 including self
  pickleball: { min: 1, max: 5 }, // total 2–6
  tennis: { min: 1, max: 3 }, // total 2–4
  table_tennis: { min: 1, max: 5 }, // total 2–6
};

export default function MemberInputs({ values, onChange }: Props) {
  const rawSport = useAuthStore((s) => s.sport);
  const sportKey = rawSport?.toLowerCase().replace(/\s+/g, "_") || "badminton";
  const limits = useMemo(
    () => LIMITS[sportKey] ?? LIMITS["badminton"],
    [sportKey]
  );

  const [count, setCount] = useState(limits.min);

  useEffect(() => {
    setCount((c) => Math.max(limits.min, Math.min(limits.max, c)));
  }, [limits]);

  const current = useMemo(() => {
    return [
      ...values,
      ...Array(Math.max(0, count - values.length)).fill(""),
    ].slice(0, count);
  }, [values, count]);

  const setAt = (i: number, v: string) => {
    const copy = [...current];
    copy[i] = v.slice(0, 4).replace(/\D/g, ""); // allow only digits, up to 4 chars
    onChange(copy);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">
          Other members ({limits?.min}–{limits?.max})
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded-lg border"
            onClick={() => setCount((c) => Math.max(limits.min, c - 1))}
          >
            -
          </button>
          <span className="text-sm">{count}</span>
          <button
            type="button"
            className="px-3 py-1 rounded-lg border"
            onClick={() => setCount((c) => Math.min(limits.max, c + 1))}
          >
            +
          </button>
        </div>
      </div>

      {current.map((v, i) => (
        <Input
          key={i}
          placeholder={`Life no #${i + 1}`}
          inputMode="numeric"
          maxLength={4}
          value={v}
          onChange={(e) => setAt(i, e.target.value)}
        />
      ))}
    </div>
  );
}
