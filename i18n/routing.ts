import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "zh", "de", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];

export function htmlLangForLocale(locale: string): string {
  if (locale === "zh") return "zh-CN";
  return locale;
}
