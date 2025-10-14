// src/components/AuthGate.tsx

"use client";
import { clearToken, getToken, isTokenExpired } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      clearToken();
      logout();
      router.replace("/login");
    } else {
      api.get("/me").catch(() => {
        // if user no longer exists
        clearToken();
        logout();
        toast.error("Session invalid. Please log in again.");
        router.replace("/login");
      });
    }
  }, [logout, router]);

  // Optional: if user is null but token exists, could fetch /me here
  if (!user) return null; // avoid flicker while checking
  return <>{children}</>;
}
