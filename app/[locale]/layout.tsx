import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LiffProvider } from "../providers/LiffProvider";
import { I18nProvider } from "../providers/I18nProvider";
import { getLocalesConfig, isValidLocale } from "@/lib/i18n/locales";
import { getMessages } from "@/lib/i18n/messages";

export async function generateStaticParams() {
  const { locales } = await getLocalesConfig();
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const config = await getLocalesConfig();

  if (!isValidLocale(locale, config)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <LiffProvider liffId={process.env.NEXT_PUBLIC_LIFF_ID ?? ""}>
        {children}
      </LiffProvider>
    </I18nProvider>
  );
}
