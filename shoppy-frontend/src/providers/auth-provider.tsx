"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo } from "react";
import { authApi } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query-keys";
import { routes } from "@/lib/config";
import type { User } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (input: { email: string; password: string }) => Promise<User>;
  register: (input: { email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const router = useRouter();

  const me = useQuery({ queryKey: queryKeys.me, queryFn: authApi.me, staleTime: 5 * 60_000, retry: false });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user }) => qc.setQueryData(queryKeys.me, user),
  });
  const registerMutation = useMutation({ mutationFn: authApi.register });
  const logoutMutation = useMutation({ mutationFn: authApi.logout });

  const login = useCallback<AuthContextValue["login"]>(
    async (input) => (await loginMutation.mutateAsync(input)).user,
    [loginMutation],
  );

  // Backend POST /users doesn't sign you in, so we chain a login.
  const register = useCallback<AuthContextValue["register"]>(
    async (input) => {
      await registerMutation.mutateAsync(input);
      return (await loginMutation.mutateAsync(input)).user;
    },
    [registerMutation, loginMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      qc.setQueryData(queryKeys.me, null);
      qc.removeQueries({ queryKey: queryKeys.products.all });
      router.replace(routes.login);
    }
  }, [logoutMutation, qc, router]);

  const user = me.data ?? null;
  const status: AuthStatus = me.isPending ? "loading" : user ? "authenticated" : "unauthenticated";

  const value = useMemo(() => ({ user, status, login, register, logout }), [user, status, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
