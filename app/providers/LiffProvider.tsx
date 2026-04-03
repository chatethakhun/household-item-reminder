"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Liff } from "@line/liff";
import liff from "@line/liff";

type LiffContextValue = {
  liff: Liff | null;
  isReady: boolean;
  error: Error | null;
};

const LiffContext = createContext<LiffContextValue | null>(null);

export function useLiffContext() {
  const ctx = useContext(LiffContext);
  if (!ctx) {
    throw new Error("useLiffContext must be used within LiffProvider");
  }
  return ctx;
}

export type LiffProviderProps = {
  liffId: string;
  children: ReactNode;
};

function LiffLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-foreground">
      <div
        className="size-9 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/70"
        aria-hidden
      />
      <p className="text-sm text-foreground/70">กำลังโหลด…</p>
    </div>
  );
}

export function LiffProvider({ liffId, children }: LiffProviderProps) {
  const [loading, setLoading] = useState(() => Boolean(liffId?.trim()));
  const [liffInstance, setLiffInstance] = useState<Liff | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!liffId.trim()) {
      setLiffInstance(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        await liff.init({ liffId: liffId.trim() });
        if (cancelled) return;
        setLiffInstance(liff);
      } catch (e) {
        if (cancelled) return;
        setLiffInstance(null);
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [liffId]);

  const value = useMemo<LiffContextValue>(
    () => ({
      liff: liffInstance,
      isReady: !loading && (!liffId.trim() || liffInstance !== null),
      error,
    }),
    [liffInstance, loading, liffId, error],
  );

  if (loading && liffId.trim()) {
    return <LiffLoading />;
  }

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
}
