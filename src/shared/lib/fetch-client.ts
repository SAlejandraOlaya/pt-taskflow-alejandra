const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com";

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
        ? "Recurso no encontrado"
        : res.status >= 500
          ? "Error del servidor, intenta de nuevo"
          : `Error inesperado (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}
