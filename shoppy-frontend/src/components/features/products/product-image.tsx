"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// curated hues that sit well with the teal/indigo/magenta theme
const HUES = [190, 265, 340, 215, 150, 305];

interface Props {
  id: number;
  name: string;
  src: string | null;
  className?: string;
  grayscale?: boolean;
}

/** Shows the uploaded photo, or a colour field seeded by the product id when there is none. */
export function ProductImage({ id, name, src, className, grayscale }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = src && failedSrc !== src;
  const hue = HUES[Math.abs(id) % HUES.length];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={showImage ? undefined : { background: `linear-gradient(135deg, oklch(0.74 0.12 ${hue}), oklch(0.52 0.17 ${(hue + 40) % 360}))` }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailedSrc(src)}
          className={cn("size-full object-cover transition duration-500", grayscale && "grayscale-[0.85] opacity-70")}
        />
      ) : (
        <div className="grid size-full place-items-center text-white/80">
          <ImageIcon className="size-8" aria-hidden />
          <span className="sr-only">No photo for {name}</span>
        </div>
      )}
    </div>
  );
}
