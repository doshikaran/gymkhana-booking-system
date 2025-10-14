// src/hooks/useCourts.ts
"use client";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useCourts() {
  return useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const { data } = await api.get("/courts");
      return data as { id: number; name: string; is_active: boolean }[];
    },
  });
}
