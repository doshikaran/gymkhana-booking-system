/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(auth)/register/page.tsx

"use client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Form = {
  full_name: string;
  life_membership_no: string;
  mobile: string;
  pin: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);

  const onSubmit = async (data: Form) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Registered! Please login.");
      router.push("/login");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail?.message || "Registration failed");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold uppercase tracking-widest">
        Create account
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          placeholder="Full name"
          {...register("full_name", { required: true })}
        />
        <Input
          placeholder="Life membership no (4 digits)"
          inputMode="numeric"
          maxLength={4}
          {...register("life_membership_no", { required: true })}
        />
        <Input
          placeholder="Mobile"
          inputMode="tel"
          {...register("mobile", { required: true })}
        />
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
          {isSubmitting ? "Creating..." : "Register"}
        </Button>
      </form>
      <p className="text-sm font-semibold tracking-widest">
        Already have an account?{" "}
        <a className="text-primary" href="/login">
          Login
        </a>
      </p>
    </div>
  );
}
