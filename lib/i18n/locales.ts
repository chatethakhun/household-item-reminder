export type LocalesConfig = {
  locales: string[];
  defaultLocale: string;
};

const FALLBACK: LocalesConfig = {
  locales: ["en", "th"],
  defaultLocale: "en",
};

let memoryCache: { data: LocalesConfig; at: number } | null = null;
const TTL_MS = 60_000;

function parseLocalesResponse(data: unknown): LocalesConfig {
  if (!data || typeof data !== "object") return FALLBACK;
  const o = data as Record<string, unknown>;
  const locales = o.locales;
  const defaultLocale = o.defaultLocale;
  if (
    Array.isArray(locales) &&
    locales.length > 0 &&
    locales.every((l): l is string => typeof l === "string")
  ) {
    const dl =
      typeof defaultLocale === "string" && locales.includes(defaultLocale)
        ? defaultLocale
        : locales[0];
    return { locales, defaultLocale: dl };
  }
  return FALLBACK;
}

/**
 * Fetches supported locales from `LOCALES_API_URL`.
 * Expected JSON: `{ "locales": ["en","th"], "defaultLocale": "en" }`
 * Cached in-memory (60s) for proxy; use `revalidate` on fetch for server routes.
 */
export async function getLocalesConfig(): Promise<LocalesConfig> {
  if (memoryCache && Date.now() - memoryCache.at < TTL_MS) {
    return memoryCache.data;
  }

  const url = process.env.LOCALES_API_URL;
  if (!url?.trim()) {
    memoryCache = { data: FALLBACK, at: Date.now() };
    return FALLBACK;
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = parseLocalesResponse(await res.json());
    memoryCache = { data: parsed, at: Date.now() };
    return parsed;
  } catch {
    memoryCache = { data: FALLBACK, at: Date.now() };
    return FALLBACK;
  }
}

export function isValidLocale(locale: string, config: LocalesConfig): boolean {
  return config.locales.includes(locale);
}
