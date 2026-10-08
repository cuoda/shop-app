"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGuestRedirect } from "@/hooks/use-guest-redirect";
import { ApiError, getErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/config";
import { cn } from "@/lib/utils";
import { passwordRules, registerSchema, type RegisterValues } from "@/lib/validators";
import { useAuth } from "@/providers/auth-provider";
import { AuthCard } from "./auth-card";
import { PasswordInput } from "./password-input";

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const router = useRouter();
  const next = useGuestRedirect();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { email: "", password: "" } });

  const password = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signUp(values);
      toast.success("Account created", { description: "You're signed in." });
      router.replace(next);
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        setError("email", { message: "An account with this email already exists." });
      } else {
        setFormError(getErrorMessage(error));
      }
    }
  });

  return (
    <AuthCard
      title="Create your account"
      subtitle="List something in a minute, or find something worth buying."
      footer={
        <>
          Already have an account?{" "}
          <Link href={routes.login} className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1" aria-label="Password requirements">
            {passwordRules.map((rule) => {
              const ok = rule.test(password);
              return (
                <li key={rule.id} className={cn("flex items-center gap-1.5 text-xs transition-colors", ok ? "text-primary" : "text-muted-foreground")}>
                  <Check className={cn("size-3.5 transition-opacity", ok ? "opacity-100" : "opacity-30")} />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </FormField>
        {formError && (
          <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Creating account" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
