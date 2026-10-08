"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedNumber({ value, format = (n) => Math.round(n).toString() }: { value: number; format?: (n: number) => string }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, format);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span className="tabular">{text}</motion.span>;
}
