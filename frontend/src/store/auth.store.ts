// src/store/auth.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  full_name: string;
  life_membership_no: string;
  mobile: string;
} | null;

type AuthState = {
  user: User;
  sport: string | null;
  setUser: (u: User) => void;
  logout: () => void;
  setSport: (s: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      sport: null,
      setUser: (u) => set({ user: u }),
      logout: () => set({ user: null }),
      setSport: (s) => set({ sport: s }),
    }),
    { name: "auth_store" }
  )
);
