// src/app/(main)/select-sport/page.tsx

"use client";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const SPORTS = [
  { name: "Badminton", emoji: "🏸" },
  { name: "Tennis", emoji: "🎾" },
  { name: "Pickleball", emoji: "🏓" },
  { name: "Table Tennis", emoji: "🏓" },
];

export default function SelectSport() {
  const router = useRouter();
  const setSport = useAuthStore((s) => s.setSport);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-2xl font-extrabold tracking-widest mb-6 text-gray-800">
        Choose Your Sport
      </h1>
      <div className="grid grid-cols-2 gap-4 w-72">
        {SPORTS.map((s) => (
          <button
            key={s.name}
            onClick={() => {
              setSport(s.name);
              router.push("/book");
            }}
            className="rounded-2xl bg-white shadow-md hover:shadow-lg transition-all py-6 text-lg font-medium flex flex-col items-center border border-gray-100"
          >
            <span className="text-3xl mb-2">{s.emoji}</span>
            <span className=" mb-2 tracking-wider font-light">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
