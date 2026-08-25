export function formatEUR(value: number | null, compact = false): string {
  if (value === null || value === undefined) return "–";
  if (compact && Math.abs(value) >= 1_000_000) {
    const mio = (value / 1_000_000).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${mio} Mio. €`;
  }
  if (compact && Math.abs(value) >= 1000) {
    const k = (value / 1000).toLocaleString("de-DE", {
      maximumFractionDigits: 0,
    });
    return `${k} T €`;
  }
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number | null): string {
  if (value === null || value === undefined) return "–";
  return `${(value * 100).toFixed(1)} %`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
