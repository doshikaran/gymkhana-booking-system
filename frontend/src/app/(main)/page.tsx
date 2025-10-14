//src / app / main / page.tsx;
"use client";

import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/auth.store";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  return (
    <>
      <Navbar />
      <main className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          🏸 Badminton Court Information
        </h1>

        <section className="bg-white rounded-2xl shadow-sm p-5 space-y-3 text-gray-700 tracking-widest">
          <p className="text-base leading-relaxed">
            <span className="font-semibold">Court Operating Hours:</span> 06:00
            – 22:00 (IST)
          </p>

          <div className="border-t border-gray-200 my-2"></div>

          <ul className="list-disc ml-5 space-y-1 text-sm">
            <li>
              <span className="font-semibold">Booking Window:</span> A member
              can book only within
              <span className="font-semibold text-primary"> 5 hours</span> of
              the desired slot.
            </li>
            <li>
              <span className="font-semibold">Coaching Sessions:</span> Coaching
              is held on
              <span className="font-semibold">
                {" "}
                Tuesday, Thursday, and Saturday from 4:30 PM – 6 PM
              </span>
              ; courts are{" "}
              <span className="text-red-600 font-semibold">
                unavailable
              </span>{" "}
              during this period.
            </li>
            <li>
              <span className="font-semibold">Players per Court:</span> Minimum
              4 and maximum 8 players (you + others).
            </li>
            <li>
              <span className="font-semibold">No-Show Policy:</span> If you book
              and fail to show up, your membership ID will be{" "}
              <span className="text-red-600 font-semibold">
                blocked for 1 week.
              </span>
            </li>
          </ul>

          <div className="border-t border-gray-200 my-2"></div>

          <ul className="list-disc ml-5 space-y-1 text-sm">
            <li>Remove your shoes outside the court area.</li>
            <li>
              Only{" "}
              <span className="font-semibold text-primary">gum-sole shoes</span>{" "}
              are permitted on court.
            </li>
          </ul>
        </section>

        {user && (
          <a
            href="/book"
            className="block bg-primary text-white py-3 rounded-xl text-center font-medium shadow hover:bg-blue-700 active:scale-[.98] transition"
          >
            Book a Court
          </a>
        )}

        {!user && (
          <p className="text-center text-sm text-gray-600">
            Please{" "}
            <a
              href="/login"
              className="text-primary font-bold text-xl underline"
            >
              login
            </a>{" "}
            to book a court.
          </p>
        )}

        <footer className="text-center text-xs text-gray-500 pt-4 pb-2">
          Respect the rules. Play fair. Enjoy your game 🏸
        </footer>
      </main>
    </>
  );
}
