const API_BASE = import.meta.env.VITE_API_URL ?? "";
const FETCH_TIMEOUT_MS = 8_000;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchWithTimeout(
  input: string,
  options?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(input, { ...options, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError("Server antwortet nicht (Timeout)", 0);
    }
    throw new ApiError("Server nicht erreichbar", 0);
  } finally {
    clearTimeout(timer);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetchWithTimeout(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Server nicht erreichbar", 0);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    if (isJson) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(
        (body as { error?: string }).error ?? res.statusText,
        res.status,
      );
    }
    if (res.status === 401) {
      throw new ApiError("Zugriff blockiert — API nicht erreichbar", 401);
    }
    throw new ApiError(
      res.status === 404
        ? "Backend unter /api nicht erreichbar"
        : res.statusText,
      res.status,
    );
  }

  if (res.status === 204) return undefined as T;
  if (!isJson) {
    throw new ApiError("Ungültige Server-Antwort (kein JSON)", res.status);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
