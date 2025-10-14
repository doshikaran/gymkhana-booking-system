/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(auth)/login/page.tsx

"use client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Form = {
  life_membership_no: string;
  pin: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);

  const onSubmit = async (data: Form) => {
    try {
      const { data: tokenResp } = await api.post("/auth/login", data);
      setToken(tokenResp.access_token);

      // fetch /me
      const { data: me } = await api.get("/me");
      setUser(me);

      toast.success("Welcome!");
      router.push("/select-sport");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail?.message || "Login failed");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold uppercase tracking-widest">
        Login
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          placeholder="Life membership number (4 digits)"
          inputMode="numeric"
          maxLength={4}
          {...register("life_membership_no", { required: true })}
        />

        {/* 👇 PIN Input with eye toggle */}
        <div className="relative">
          <Input
            type={showPin ? "text" : "password"}
            placeholder="6-digit PIN"
            inputMode="numeric"
            maxLength={6}
            {...register("pin", { required: true })}
          />
          <button
            type="button"
            onClick={() => setShowPin((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>

      <p className="text-sm font-semibold tracking-widest">
        No account?{" "}
        <a className="text-primary" href="/register">
          Register
        </a>
      </p>
    </div>
  );
}
