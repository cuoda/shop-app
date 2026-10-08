import { cn } from "@/lib/utils";
import { fieldStyles } from "./input";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldStyles, "min-h-32 resize-y py-3 leading-relaxed", className)} {...props} />;
}
