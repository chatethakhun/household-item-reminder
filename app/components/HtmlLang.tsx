"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export function HtmlLang() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : null;

  useEffect(() => {
    if (locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
