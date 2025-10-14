// src/components/ui/Input.tsx
"use client";
import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...p }, ref) => (
  <input
    ref={ref}
    {...p}
    className={twMerge(
      "w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary",
      className
    )}
  />
));
Input.displayName = "Input";
