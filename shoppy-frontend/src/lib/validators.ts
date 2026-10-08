import { z } from "zod";
import { IMAGE_RULES, PRICE_MAX } from "./config";
import { formatBytes } from "./format";

// Mirrors class-validator rules in the backend DTOs.

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const passwordRules = [
  { id: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { id: "lower", label: "A lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { id: "upper", label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "A number", test: (v: string) => /\d/.test(v) },
  { id: "symbol", label: "A symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export const registerSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Choose a password")
    .refine((v) => passwordRules.every((r) => r.test(v)), "Password doesn't meet all the requirements"),
});
export type RegisterValues = z.infer<typeof registerSchema>;

// price stays a string in the form and is converted on submit
export const productSchema = z.object({
  name: z.string().trim().min(1, "Give your product a name").max(120, "Keep the name under 120 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Describe what you're selling")
    .max(2000, "Keep the description under 2000 characters"),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a price like 49 or 49.99")
    .refine((v) => Number(v) > 0, "Price must be more than $0")
    .refine((v) => Number(v) <= PRICE_MAX, "Price can't be more than $999,999.99"),
});
export type ProductFormValues = z.infer<typeof productSchema>;

/** Returns an error message, or null when the file is acceptable. */
export function validateImage(file: File): string | null {
  if (!(IMAGE_RULES.types as readonly string[]).includes(file.type)) return "Use a JPG, PNG or GIF image.";
  if (file.size > IMAGE_RULES.maxBytes) {
    return `Image is ${formatBytes(file.size)}. The limit is ${formatBytes(IMAGE_RULES.maxBytes)}.`;
  }
  return null;
}
