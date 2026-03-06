const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com";

/** Wrapper over fetch that returns typed JSON and throws on non-2xx. */
export async function fetchClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const message =
      res.status === 404
        ? "Resource not found"
        : res.status >= 500
          ? "Server error, try again"
          : `Unexpected error (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}
