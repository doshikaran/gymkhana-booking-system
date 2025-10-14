// src/components/Booking/DateToggle.tsx
"use client";
type Props = {
  value: "today" | "tomorrow";
  onChange: (v: "today" | "tomorrow") => void;
};
export default function DateToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        className={`py-2 rounded-xl tracking-widest ${
          value === "today" ? "bg-primary text-white" : "bg-white border"
        }`}
        onClick={() => onChange("today")}
      >
        Today
      </button>
      <button
        className={`py-2 rounded-xl tracking-widest ${
          value === "tomorrow" ? "bg-primary text-white" : "bg-white border"
        }`}
        onClick={() => onChange("tomorrow")}
      >
        Tomorrow
      </button>
    </div>
  );
}
