import type { LoginResponse, User } from "@/types";
import { api, ApiError } from "./client";

export const authApi = {
  register: (input: { email: string; password: string }) =>
    api<User>("/users", { method: "POST", json: input }),

  login: (input: { email: string; password: string }) =>
    api<LoginResponse>("/auth/login", { method: "POST", json: input }),

  logout: () => api<{ success: true }>("/auth/logout", { method: "POST" }),

  /** Resolves to null when there is no valid session (401). */
  async me(): Promise<User | null> {
    try {
      return await api<User>("/users/me");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },
};
