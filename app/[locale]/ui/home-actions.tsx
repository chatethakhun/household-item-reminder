"use client";

import { useI18n } from "@/app/providers/I18nProvider";

export function HomeActions() {
  const { t } = useI18n();

  return (
    <>
      <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {t("home.title")}
      </p>
      <p className="max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-500">
        {t("home.subtitle")}
      </p>
    </>
  );
}
