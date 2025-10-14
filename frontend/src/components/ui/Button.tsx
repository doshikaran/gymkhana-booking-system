// src/components/ui/Button.tsx
"use client";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
export default function Button({
  className,
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={twMerge(
        "px-4 py-3 rounded-xl bg-primary text-white font-medium w-full disabled:opacity-60 active:scale-[.99] transition",
        className
      )}
    />
  );
}
