export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const BASE = "/api";

interface ApiOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
  form?: FormData;
}

export async function api<T>(path: string, { json, form, headers, ...init }: ApiOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      credentials: "include",
      ...init,
      headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : form,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const raw = (data as { message?: string | string[] } | null)?.message;
    const details = Array.isArray(raw) ? raw : raw ? [raw] : [];
    throw new ApiError(res.status, details[0] ?? (res.statusText || "Something went wrong"), details);
  }
  return data as T;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Try again.") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
