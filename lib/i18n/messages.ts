import { cache } from "react";
import en from "@/messages/en.json";
import th from "@/messages/th.json";

export type Messages = Record<string, unknown>;

const FALLBACK_MESSAGES: Record<string, Messages> = {
  en: {
    ...en,
  },
  th: {
    ...th,
  },
};

function mergeFallback(locale: string, data: Messages): Messages {
  const fb = FALLBACK_MESSAGES[locale] ?? FALLBACK_MESSAGES.en;
  return { ...fb, ...data };
}

/**
 * Loads translation JSON for `locale` from `MESSAGES_API_URL`.
 * Use `{locale}` in the URL, e.g. `https://api.example.com/i18n/{locale}`
 */
export const getMessages = cache(async (locale: string): Promise<Messages> => {
  const url =
    locale === "en"
      ? (process.env.MESSAGES_API_EN_URL ?? "")
      : (process.env.MESSAGES_API_TH_URL ?? "");

  try {
    const res = await fetch(url, {
      headers: {
        "X-Master-Key": process.env.MESSAGES_API_KEY ?? "",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as unknown;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return mergeFallback(locale, {});
    }
    return mergeFallback(locale, data as Messages);
  } catch {
    return mergeFallback(locale, {});
  }
});
