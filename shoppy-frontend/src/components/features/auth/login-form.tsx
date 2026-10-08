"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGuestRedirect } from "@/hooks/use-guest-redirect";
import { ApiError, getErrorMessage } from "@/lib/api/client";
import { routes } from "@/lib/config";
import { loginSchema, type LoginValues } from "@/lib/validators";
import { useAuth } from "@/providers/auth-provider";
import { AuthCard } from "./auth-card";
import { PasswordInput } from "./password-input";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = useGuestRedirect();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login(values);
      toast.success("Welcome back");
      router.replace(next);
    } catch (error) {
      setFormError(error instanceof ApiError && error.status === 401 ? "That email and password don't match." : getErrorMessage(error));
    }
  });

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to browse listings and manage your own."
      footer={
        <>
          New here?{" "}
          <Link href={routes.register} className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="current-password" placeholder="Your password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
        </FormField>
        {formError && (
          <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
