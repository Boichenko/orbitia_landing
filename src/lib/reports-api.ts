export type City = {
  label: string;
  display_name?: string;
  lat: number;
  lon: number;
};

const API_BASE =
  (import.meta.env.VITE_ORBITIA_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "/api/orbitia";

const API_TOKEN = import.meta.env.VITE_ORBITIA_API_TOKEN as string | undefined;

function apiHeaders(extra?: HeadersInit): HeadersInit {
  return {
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    ...extra,
  };
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<City[]> {
  const params = new URLSearchParams({ q: query, limit: "6" });
  const response = await fetch(`${API_BASE}/cities?${params}`, {
    headers: apiHeaders(),
    signal,
  });
  if (!response.ok) {
    throw new Error("Не удалось найти город");
  }
  return response.json();
}

function filenameFromDisposition(value: string | null, fallback: string) {
  if (!value) return fallback;
  const utfMatch = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
  const match = value.match(/filename="?([^";]+)"?/i);
  return match?.[1] ? decodeURIComponent(match[1]) : fallback;
}

export async function requestReportPdf(
  path: "/reports/solar" | "/reports/synastry",
  payload: unknown,
) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: apiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Не удалось сформировать PDF");
  }

  const blob = await response.blob();
  const filename = filenameFromDisposition(
    response.headers.get("content-disposition"),
    path.includes("synastry") ? "orbitia-synastry.pdf" : "orbitia-solar.pdf",
  );
  return { blob, filename };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
