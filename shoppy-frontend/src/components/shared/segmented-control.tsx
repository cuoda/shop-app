"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className="glass inline-flex rounded-xl p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn("relative rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors", active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {active && <motion.span layoutId={id} className="absolute inset-0 rounded-lg bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
