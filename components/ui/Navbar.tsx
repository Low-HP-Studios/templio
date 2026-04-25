"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const sectionNavIds = ["home", "manifesto", "work", "pitch"] as const;

function GlobeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M3 10h14M10 3c2 2 3 4.3 3 7s-1 5-3 7M10 3c-2 2-3 4.3-3 7s1 5 3 7" />
    </svg>
  );
}

function ThemeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4M15.7 15.7l-1.4-1.4M5.7 5.7 4.3 4.3" />
      <circle cx="10" cy="10" r="3.5" />
    </svg>
  );
}

export function Navbar({ includeSpacer = true }: { includeSpacer?: boolean }) {
  const t = useTranslations("nav");
  const tLocale = useTranslations("localeLabel");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") return;

    const setFromScroll = () => {
      const navIds = [...sectionNavIds];
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const line = 6.75 * rem;
      let current = navIds[0] ?? "home";
      for (const id of navIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    setFromScroll();
    window.addEventListener("scroll", setFromScroll, { passive: true });
    window.addEventListener("resize", setFromScroll);

    return () => {
      window.removeEventListener("scroll", setFromScroll);
      window.removeEventListener("resize", setFromScroll);
    };
  }, [pathname]);

  const interactiveClasses =
    "cursor-pointer rounded-[5px] text-white transition-[background-color,box-shadow,transform] duration-200 hover:bg-sky-500/10 hover:shadow-[inset_0_0_0_2px_#0696d7] active:translate-y-px active:bg-sky-500/15 active:shadow-[inset_0_0_0_2px_#0696d7] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_#0696d7]";
  const linkClasses = `${interactiveClasses} relative px-3 py-2`;

  const labelFor = (id: (typeof sectionNavIds)[number]) => {
    switch (id) {
      case "home":
        return t("home");
      case "manifesto":
        return t("manifesto");
      case "work":
        return t("work");
      case "pitch":
        return t("pitch");
      default:
        return "";
    }
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 w-full bg-black text-white">
        <div className="border-b border-white/10">
          <Container
            size="xl"
            className="flex h-16 items-center justify-between gap-4"
          >
            <Link
              href="/"
              className={`${interactiveClasses} inline-flex h-12 items-center gap-2 px-2 sm:gap-3`}
              onClick={() => setActiveSection("home")}
            >
              <Image
                src="/logo/logo.svg"
                alt=""
                width={217}
                height={198}
                priority
                className="h-5 w-auto sm:h-6"
              />
              <span className="font-[family-name:var(--font-style-script)] text-2xl leading-none text-white sm:text-[1.7rem]">
                Templio
              </span>
            </Link>
            <div className="flex items-center gap-2 text-white sm:gap-3">
              <label className="sr-only" htmlFor="locale-select">
                {t("selectLanguage")}
              </label>
              <div
                className={`${interactiveClasses} inline-flex items-center gap-2 px-3 py-2 text-sm font-medium`}
              >
                <GlobeIcon />
                <select
                  id="locale-select"
                  value={locale}
                  aria-label={t("selectLanguage")}
                  className="max-w-[6.5rem] cursor-pointer appearance-none border-0 bg-transparent pr-1 text-sm font-medium text-white outline-none"
                  onChange={(e) => {
                    const next = e.target.value as AppLocale;
                    if (next === locale) return;
                    router.replace(pathname, { locale: next });
                  }}
                >
                  {routing.locales.map((code) => (
                    <option key={code} value={code}>
                      {tLocale(code)}
                    </option>
                  ))}
                </select>
              </div>
              <span aria-hidden className="h-5 w-px bg-white/25" />
              <button
                type="button"
                aria-label={t("switchTheme")}
                className={`${interactiveClasses} inline-flex h-9 w-9 items-center justify-center`}
              >
                <ThemeIcon />
              </button>
            </div>
          </Container>
        </div>
        <div className="border-b border-white/10 bg-black">
          <Container
            size="xl"
            className="flex h-11 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-white sm:gap-2 sm:text-[0.95rem]">
              {sectionNavIds.map((id) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={isActive ? "page" : undefined}
                    className={linkClasses}
                    onClick={() => setActiveSection(id)}
                  >
                    {labelFor(id)}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 bottom-1 h-px bg-[#0696d7] transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                );
              })}
            </div>
          </Container>
        </div>
      </nav>
      {includeSpacer && <div aria-hidden className="h-[6.75rem] shrink-0" />}
    </>
  );
}
