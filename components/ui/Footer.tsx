"use client";

import { useTranslations } from "next-intl";
import { Container } from "./Container";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative z-10 w-full">
      <Container
        size="lg"
        className="flex flex-col items-center justify-between gap-4 py-6 text-sm sm:flex-row sm:gap-0 sm:py-8 sm:text-base"
      >
        <p className="text-white/50">
          {t("by")}{" "}
          <a
            href="https://www.ayush.im"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white underline transition-opacity hover:opacity-80"
          >
            Ayush Rameja
          </a>
        </p>
        <p className="text-white/50">{t("copyright")}</p>
      </Container>
    </footer>
  );
}
