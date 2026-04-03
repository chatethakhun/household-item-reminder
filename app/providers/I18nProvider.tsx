"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { Messages } from "@/lib/i18n/messages";
import { getMessageString } from "@/lib/i18n/translate";

type I18nContextValue = {
  locale: string;
  messages: Messages;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export type I18nProviderProps = {
  locale: string;
  messages: Messages;
  children: ReactNode;
};

export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  const t = useCallback(
    (key: string) => getMessageString(messages, key) ?? key,
    [messages],
  );

  const value = useMemo(
    () => ({ locale, messages, t }),
    [locale, messages, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}
