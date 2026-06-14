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

const isSectionNavId = (
  value: string
): value is (typeof sectionNavIds)[number] =>
  (sectionNavIds as readonly string[]).includes(value);

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

function MenuIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M3.5 6.5h13M3.5 13.5h13" />
    </svg>
  );
}

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  );
}

export function Navbar() {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const listboxId = "locale-listbox";
  const themeListboxId = "theme-listbox";
  const isLanding = pathname === "/";

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const root = document.documentElement;
    const syncNavHeight = () => {
      root.style.setProperty("--templio-nav-height", `${nav.offsetHeight}px`);
    };

    syncNavHeight();
    const resizeObserver = new ResizeObserver(syncNavHeight);
    resizeObserver.observe(nav);
    window.addEventListener("resize", syncNavHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncNavHeight);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!isLanding) return;

    const setFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (!isSectionNavId(id)) return false;
      setActiveSection(id);
      return true;
    };

    const setFromScroll = () => {
      const navIds = [...sectionNavIds];
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const navHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--templio-nav-height"
          )
        ) || 4.5 * rem;
      const line = navHeight + 2 * rem;
      let current = navIds[0] ?? "home";

      for (const id of navIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }

      setActiveSection(current);
    };

    let frameId = 0;
    const syncAfterAnchorScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        if (!setFromHash()) setFromScroll();
      });
    };
    const timeoutId = window.setTimeout(() => {
      if (!setFromHash()) setFromScroll();
    }, 120);

    if (!setFromHash()) setFromScroll();
    syncAfterAnchorScroll();
    window.addEventListener("scroll", setFromScroll, { passive: true });
    window.addEventListener("resize", setFromScroll);
    window.addEventListener("hashchange", syncAfterAnchorScroll);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", setFromScroll);
      window.removeEventListener("resize", setFromScroll);
      window.removeEventListener("hashchange", syncAfterAnchorScroll);
    };
  }, [isLanding]);

  useEffect(() => {
    if (!langOpen && !themeOpen && !menuOpen) return;

    const close = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setLangOpen(false);
        setThemeOpen(false);
        setMenuOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setThemeOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen, themeOpen, menuOpen]);

  const labelForThemeChoice = (choice: ThemeChoice) => {
    if (choice === "light") return t("themeLight");
    if (choice === "dark") return t("themeDark");
    return t("themeSystem");
  };

  const currentThemeLabel = labelForThemeChoice(
    (theme ?? "system") as ThemeChoice
  );

  const currentLocalePrefix =
    locale === routing.defaultLocale ? "" : `/${locale}`;

  const hrefFor = (id: (typeof sectionNavIds)[number]) =>
    isLanding ? `#${id}` : `${currentLocalePrefix}/#${id}`;

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

  const navButtonClasses =
    "inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-zinc-900 dark:hover:text-white";

  const renderNavLinks = (mobile = false) =>
    sectionNavIds.map((id) => {
      const isActive = isLanding && activeSection === id;
      return (
        <a
          key={id}
          href={hrefFor(id)}
          aria-current={isActive ? "page" : undefined}
          className={`relative rounded-md text-sm font-medium transition ${
            mobile
              ? "flex items-center justify-between px-3 py-3 text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/5"
              : "px-3 py-2 text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          } ${isActive ? "text-zinc-950 dark:text-white" : ""}`}
          onClick={() => {
            setActiveSection(id);
            setMenuOpen(false);
          }}
        >
          {labelFor(id)}
          <span
            aria-hidden
            className={`absolute ${
              mobile ? "inset-y-3 right-3 w-px" : "inset-x-3 -bottom-0.5 h-px"
            } bg-lime-400 transition-opacity ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
        </a>
      );
    });

  return (
    <nav
      ref={navRef}
      className="sticky inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white/90 text-zinc-950 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90 dark:text-white"
    >
      <Container
        size="xl"
        className="flex min-h-[4.5rem] items-center justify-between gap-3 py-2"
      >
        <Link
          href="/"
          className="inline-flex min-w-0 items-center gap-2 rounded-md px-1 py-1 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
          onClick={() => {
            setActiveSection("home");
            setMenuOpen(false);
          }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-950 dark:bg-white">
            <Image
              src="/logo/logo.svg"
              alt=""
              width={40}
              height={40}
              priority
              className="h-5 w-auto dark:invert"
            />
          </span>
          <span className="font-display text-2xl leading-none sm:text-[1.7rem]">
            Templio
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {renderNavLinks()}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              id="locale-trigger"
              aria-label={`${t("selectLanguage")}: ${tLocaleName(locale)} · ${tLocale(locale)}`}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-controls={listboxId}
              className={`${navButtonClasses} max-w-[6.25rem] gap-1.5 px-2.5 sm:max-w-44 sm:px-3`}
              onClick={() => {
                setLangOpen((o) => !o);
                setThemeOpen(false);
              }}
            >
              <GlobeIcon className="h-4 w-4 shrink-0" />
              <span className="truncate" suppressHydrationWarning>
                <span className="sm:hidden">{tLocale(locale)}</span>
                <span className="hidden sm:inline">
                  {tLocaleName(locale)}
                  <span className="text-zinc-400 dark:text-zinc-500"> · </span>
                  {tLocale(locale)}
                </span>
              </span>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  langOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {langOpen && (
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby="locale-trigger"
                className="absolute right-0 top-full z-60 mt-2 min-w-52 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-md border border-zinc-200 bg-white py-1 text-sm text-zinc-900 shadow-[0_18px_50px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
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
                            ? "bg-lime-100 text-zinc-950 dark:bg-lime-300/15 dark:text-lime-100"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                        onClick={() => {
                          setLangOpen(false);
                          if (code === locale) return;
                          router.replace(pathname, { locale: code });
                        }}
                      >
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {tLocaleName(code)}
                          <span className="text-zinc-400"> · </span>
                          <span>{tLocale(code)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              id="theme-trigger"
              aria-label={`${t("selectTheme")}: ${currentThemeLabel}`}
              aria-haspopup="listbox"
              aria-expanded={themeOpen}
              aria-controls={themeListboxId}
              suppressHydrationWarning
              className={`${navButtonClasses} max-w-[5.5rem] gap-1.5 px-2.5 sm:max-w-36 sm:px-3`}
              onClick={() => {
                setThemeOpen((o) => !o);
                setLangOpen(false);
              }}
            >
              <ThemeIcon className="h-4 w-4 shrink-0" />
              <span
                className="hidden truncate sm:inline"
                suppressHydrationWarning
              >
                {currentThemeLabel}
              </span>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  themeOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {themeOpen && (
              <ul
                id={themeListboxId}
                role="listbox"
                aria-labelledby="theme-trigger"
                className="absolute right-0 top-full z-60 mt-2 min-w-44 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-md border border-zinc-200 bg-white py-1 text-sm text-zinc-900 shadow-[0_18px_50px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
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
                            ? "bg-lime-100 text-zinc-950 dark:bg-lime-300/15 dark:text-lime-100"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
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

          <button
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            className={`${navButtonClasses} px-2.5 md:hidden`}
            onClick={() => {
              setMenuOpen((o) => !o);
              setLangOpen(false);
              setThemeOpen(false);
            }}
          >
            {menuOpen ? (
              <XIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div className="border-t border-zinc-200/80 bg-white/95 md:hidden dark:border-white/10 dark:bg-zinc-950/95">
          <Container size="xl" className="py-3">
            <div className="grid gap-1">{renderNavLinks(true)}</div>
          </Container>
        </div>
      )}
    </nav>
  );
}
