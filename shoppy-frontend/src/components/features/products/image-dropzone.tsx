"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IMAGE_RULES } from "@/lib/config";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { validateImage } from "@/lib/validators";

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function ImageDropzone({ file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function accept(candidate: File | undefined) {
    if (!candidate) return;
    const problem = validateImage(candidate);
    setError(problem);
    if (!problem) onChange(candidate);
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files[0]);
        }}
        className={cn("relative grid min-h-52 place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-[var(--glass)] backdrop-blur-md transition-colors", dragging ? "border-primary bg-primary/10" : "border-input")}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Selected product photo" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white">
              <span className="truncate">{file?.name} · {file && formatBytes(file.size)}</span>
              <Button type="button" size="sm" variant="glass" onClick={() => onChange(null)} aria-label="Remove photo">
                <X /> Remove
              </Button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <ImagePlus className="size-6" />
            </span>
            <span className="font-semibold">Drop a photo here or browse</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or GIF, up to {formatBytes(IMAGE_RULES.maxBytes)}</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept={IMAGE_RULES.types.join(",")} className="sr-only" tabIndex={-1} onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
