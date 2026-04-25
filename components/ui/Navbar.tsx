"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Container } from "@/components/ui";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const sectionNavIds = ["home", "manifesto", "work", "pitch"] as const;
const themeChoices = ["light", "dark", "system"] as const;
type ThemeChoice = (typeof themeChoices)[number];

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

function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

export function Navbar({ includeSpacer = true }: { includeSpacer?: boolean }) {
  const t = useTranslations("nav");
  const tLocale = useTranslations("localeLabel");
  const tLocaleName = useTranslations("localeName");
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const [activeSection, setActiveSection] = useState("home");
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  const listboxId = "locale-listbox";
  const themeListboxId = "theme-listbox";

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

  useEffect(() => {
    if (!langOpen && !themeOpen) return;
    const close = (e: MouseEvent) => {
      if (!headerControlsRef.current?.contains(e.target as Node)) {
        setLangOpen(false);
        setThemeOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen, themeOpen]);

  const labelForThemeChoice = (choice: ThemeChoice) => {
    if (choice === "light") return t("themeLight");
    if (choice === "dark") return t("themeDark");
    return t("themeSystem");
  };

  const currentThemeLabel = labelForThemeChoice(
    (theme ?? "system") as ThemeChoice
  );

  const mainBarInteractive =
    "cursor-pointer rounded-[5px] text-white transition-[background-color,box-shadow,transform] duration-200 hover:bg-sky-500/10 hover:shadow-[inset_0_0_0_2px_#0696d7] active:translate-y-px active:bg-sky-500/15 active:shadow-[inset_0_0_0_2px_#0696d7] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_#0696d7]";

  const subBarInteractive =
    "cursor-pointer rounded-[5px] text-zinc-900 transition-[background-color,box-shadow,transform] duration-200 hover:bg-sky-500/10 hover:shadow-[inset_0_0_0_2px_#0696d7] active:translate-y-px active:bg-sky-500/15 active:shadow-[inset_0_0_0_2px_#0696d7] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_#0696d7] dark:text-white";
  const linkClasses = `${subBarInteractive} relative px-3 py-2`;

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
      <nav className="fixed inset-x-0 top-0 z-50 w-full">
        <div className="border-b border-white/10 bg-black text-white">
          <Container
            size="xl"
            className="flex h-16 items-center justify-between gap-4"
          >
            <Link
              href="/"
              className={`${mainBarInteractive} inline-flex h-12 items-center gap-2 px-2 sm:gap-3`}
              onClick={() => setActiveSection("home")}
            >
              <Image
                src="/logo/logo.svg"
                alt=""
                width={40}
                height={40}
                priority
                className="h-5 w-auto sm:h-6"
              />
              <span className="font-(family-name:--font-style-script) text-2xl leading-none text-white sm:text-[1.7rem]">
                Templio
              </span>
            </Link>
            <div
              ref={headerControlsRef}
              className="flex items-center gap-2 text-white sm:gap-3"
            >
              <div className="relative">
                <button
                  type="button"
                  id="locale-trigger"
                  aria-label={`${t("selectLanguage")}: ${tLocaleName(locale)} · ${tLocale(locale)}`}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  aria-controls={listboxId}
                  className={`${mainBarInteractive} inline-flex h-9 min-w-0 max-w-[min(16rem,42vw)] items-center gap-1.5 px-2.5 text-left text-sm sm:h-10 sm:max-w-[20rem] sm:px-3`}
                  onClick={() => {
                    setLangOpen((o) => !o);
                    setThemeOpen(false);
                  }}
                >
                  <GlobeIcon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate font-medium text-white">
                    {tLocaleName(locale)}
                    <span className="text-white/45"> · </span>
                    <span className="text-white/60">{tLocale(locale)}</span>
                  </span>
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 shrink-0 text-white/80 transition-transform duration-200 ${
                      langOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {langOpen && (
                  <ul
                    id={listboxId}
                    role="listbox"
                    aria-labelledby="locale-trigger"
                    className="absolute right-0 top-full z-60 mt-1 min-w-50 max-w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-md border border-white/10 bg-zinc-950 py-1 text-sm text-white shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
                  >
                    {routing.locales.map((code) => {
                      const selected = code === locale;
                      return (
                        <li key={code} role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                              selected
                                ? "bg-sky-500/15 text-sky-100"
                                : "text-zinc-200 hover:bg-white/5 hover:text-white"
                            }`}
                            onClick={() => {
                              setLangOpen(false);
                              if (code === locale) return;
                              router.replace(pathname, { locale: code });
                            }}
                          >
                            <span className="min-w-0 flex-1 truncate font-medium">
                              {tLocaleName(code)}
                              <span
                                className={
                                  selected ? "text-sky-200/50" : "text-zinc-500"
                                }
                              >
                                {" "}
                                ·{" "}
                              </span>
                              <span
                                className={
                                  selected ? "text-sky-200/80" : "text-zinc-400"
                                }
                              >
                                {tLocale(code)}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <span aria-hidden className="h-5 w-px bg-white/25" />
              <div className="relative">
                <button
                  type="button"
                  id="theme-trigger"
                  aria-label={`${t("selectTheme")}: ${currentThemeLabel}`}
                  aria-haspopup="listbox"
                  aria-expanded={themeOpen}
                  aria-controls={themeListboxId}
                  suppressHydrationWarning
                  className={`${mainBarInteractive} inline-flex h-9 min-w-0 max-w-[min(12rem,38vw)] items-center gap-1.5 px-2.5 text-left text-sm sm:h-10 sm:max-w-56 sm:px-3`}
                  onClick={() => {
                    setThemeOpen((o) => !o);
                    setLangOpen(false);
                  }}
                >
                  <ThemeIcon className="h-4 w-4 shrink-0" />
                  <span
                    className="min-w-0 flex-1 truncate font-medium text-white"
                    suppressHydrationWarning
                  >
                    {currentThemeLabel}
                  </span>
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 shrink-0 text-white/80 transition-transform duration-200 ${
                      themeOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {themeOpen && (
                  <ul
                    id={themeListboxId}
                    role="listbox"
                    aria-labelledby="theme-trigger"
                    className="absolute right-0 top-full z-60 mt-1 min-w-50 max-w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-md border border-white/10 bg-zinc-950 py-1 text-sm text-white shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
                  >
                    {themeChoices.map((choice) => {
                      const active = (theme ?? "system") === choice;
                      return (
                        <li key={choice} role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                              active
                                ? "bg-sky-500/15 text-sky-100"
                                : "text-zinc-200 hover:bg-white/5 hover:text-white"
                            }`}
                            onClick={() => {
                              setThemeOpen(false);
                              setTheme(choice);
                            }}
                          >
                            {labelForThemeChoice(choice)}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </Container>
        </div>
        <div className="border-b border-zinc-200/90 bg-zinc-50/90 dark:border-white/10 dark:bg-black">
          <Container
            size="xl"
            className="flex h-11 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-zinc-900 sm:gap-2 sm:text-[0.95rem] dark:text-white">
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
      {includeSpacer && <div aria-hidden className="h-27 shrink-0" />}
    </>
  );
}
