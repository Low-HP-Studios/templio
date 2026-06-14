"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAction, useMutation } from "convex/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { SHOWCASE_SITES } from "@/constants";
import { Container, Footer, Navbar, ThemeToaster } from "@/components/ui";

type Step = "idea" | "email";
type Status = "idle" | "loading" | "success" | "already_exists" | "error";
type HeroShowcaseItem = {
  site: (typeof SHOWCASE_SITES)[number];
  name: string;
  category: string;
};

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function EmphasisText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "i"
  );

  return (
    <>
      {text
        .split(regex)
        .filter(Boolean)
        .map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={i}
              className="font-display text-[1.14em] leading-none text-sky-700 dark:text-sky-200"
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="min-w-0 break-words text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
      {children}
    </p>
  );
}

function HeroShowcaseCarousel({ items }: { items: HeroShowcaseItem[] }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0];

  useEffect(() => {
    if (items.length < 2) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [items.length, reduceMotion]);

  if (!active) return null;

  const accentStyle = {
    "--site-accent": active.site.accent,
    "--site-accent-rgb": active.site.accentRgb,
  } as CSSProperties;

  return (
    <div
      className="relative"
      style={accentStyle}
      data-hero-showcase
      data-active-site={active.site.id}
    >
      <motion.a
        href={active.site.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ duration: reduceMotion ? 0 : 0.35 }}
      >
        <div className="relative aspect-[1.18] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 shadow-[0_26px_90px_rgba(15,23,42,0.16)] dark:border-white/10 dark:shadow-[0_26px_90px_rgba(0,0,0,0.55)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.site.id}
              className="absolute inset-0"
              initial={
                reduceMotion
                  ? false
                  : {
                      clipPath: "inset(0 0 18% 0)",
                      opacity: 0,
                      scale: 1.025,
                      y: 18,
                    }
              }
              animate={{
                clipPath: "inset(0 0 0% 0)",
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      clipPath: "inset(16% 0 0 0)",
                      opacity: 0,
                      scale: 0.985,
                      y: -18,
                    }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src={active.site.preview}
                alt={`${active.name} website preview`}
                fill
                loading={activeIndex === 0 ? "eager" : "lazy"}
                fetchPriority={activeIndex === 0 ? "high" : "auto"}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </motion.div>
          </AnimatePresence>

          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,rgba(0,0,0,0.78)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-[var(--site-accent)]"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-300">
              {active.category}
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold leading-tight sm:text-3xl">
                  {active.name}
                </h2>
                <p className="mt-1 truncate text-sm font-medium text-zinc-300">
                  {active.site.urlLabel}
                </p>
              </div>
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-zinc-950 sm:flex">
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </motion.a>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.site.href}
              type="button"
              aria-label={`${item.name} preview`}
              aria-pressed={isActive}
              className={`h-1.5 rounded-full transition ${
                isActive
                  ? "bg-zinc-950 dark:bg-white"
                  : "bg-zinc-200 hover:bg-zinc-300 dark:bg-white/15 dark:hover:bg-white/30"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ShowcaseCard({
  site,
  name,
  category,
  description,
  index,
}: {
  site: (typeof SHOWCASE_SITES)[number];
  name: string;
  category: string;
  description: string;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const accentStyle = {
    "--site-accent": site.accent,
    "--site-accent-rgb": site.accentRgb,
  } as CSSProperties;

  return (
    <motion.a
      href={site.href}
      target="_blank"
      rel="noopener noreferrer"
      style={accentStyle}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white outline-none transition-colors hover:border-[color:var(--site-accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:focus-visible:ring-offset-zinc-950"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : index * 0.04,
      }}
    >
      <div className="relative aspect-[1.65] overflow-hidden border-b border-zinc-200 bg-zinc-950 dark:border-white/10">
        <Image
          src={site.preview}
          alt={`${name} website preview`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-[var(--site-accent)]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            {category}
          </p>
          <span className="text-xs font-medium tabular-nums text-zinc-400">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold leading-tight text-zinc-950 dark:text-white">
          {name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold">
          <span className="min-w-0 truncate text-zinc-500 dark:text-zinc-400">
            {site.urlLabel}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-zinc-950 transition group-hover:text-[var(--site-accent)] dark:text-white">
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function LandingPage() {
  const t = useTranslations();
  const tForm = useTranslations("form");
  const tShowcaseSites = useTranslations("showcaseSites");
  const [step, setStep] = useState<Step>("idea");
  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const ideaInputRef = useRef<HTMLTextAreaElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const heroShowcaseItems = SHOWCASE_SITES.map((site) => ({
    site,
    name: tShowcaseSites(`${site.id}.name`),
    category: tShowcaseSites(`${site.id}.category`),
  }));

  const joinWaitlist = useMutation(api.waitlist.join);
  const sendWelcomeEmail = useAction(api.waitlistEmail.sendWelcomeEmail);

  useEffect(() => {
    const focusPitchInput = () => {
      if (window.location.hash !== "#pitch") return;

      window.setTimeout(() => {
        if (step === "email") {
          emailInputRef.current?.focus();
          return;
        }

        ideaInputRef.current?.focus();
      }, 120);
    };

    focusPitchInput();
    window.addEventListener("hashchange", focusPitchInput);

    return () => window.removeEventListener("hashchange", focusPitchInput);
  }, [step]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setStep("email");
  };

  const handleIdeaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (idea.trim()) setStep("email");
    }
  };

  const handleEditIdea = () => {
    setStep("idea");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setSubmittedEmail(email);

    const trimmedIdea = idea.trim();

    try {
      const result = await joinWaitlist({
        email,
        idea: trimmedIdea || undefined,
      });

      if (result.alreadyExists) {
        setStatus("already_exists");
        toast.warning(tForm("alreadyExistsMessage"));
        return;
      }

      const emailResult = await sendWelcomeEmail({
        email,
        idea: trimmedIdea || undefined,
      });

      if (!emailResult.success) {
        console.info("Welcome email skipped:", emailResult.reason);
      }

      setStatus("success");
      toast.success(tForm("pitchReceivedToast"));
    } catch (error) {
      setStatus("error");
      const errorMsg =
        error instanceof Error ? error.message : tForm("errorToast");

      if (errorMsg.includes("Invalid email")) {
        toast.error(tForm("invalidEmailToast"));
      } else {
        toast.error(tForm("errorToast"));
      }

      console.error(error);
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 3000);
    }
  };

  const isLoading = status === "loading";
  const isSubmitted = status === "success" || status === "already_exists";

  const formMessage =
    status === "success"
      ? tForm("successMessage")
      : status === "already_exists"
        ? tForm("alreadyExistsMessage")
        : "";

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <ThemeToaster />
      <Navbar />

      <main>
        <section
          id="home"
          className="scroll-mt-[calc(var(--templio-nav-height,4.5rem)+1rem)] border-b border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950"
        >
          <Container
            size="xl"
            className="grid min-h-[calc(100svh-var(--templio-nav-height,4.5rem)-2rem)] items-center gap-10 py-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:py-16 lg:gap-14"
          >
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                {t("hero.eyebrow")}
              </p>
              <h1 className="mt-5 max-w-[11ch] text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl dark:text-white">
                {t("hero.h1")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
                {t("hero.sub")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#pitch"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  {t("hero.cta")}
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
                <a
                  href="#work"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:border-white/20 dark:hover:bg-zinc-800"
                >
                  {t("nav.work")}
                </a>
              </div>
            </div>

            <div className="min-w-0">
              <HeroShowcaseCarousel items={heroShowcaseItems} />
            </div>
          </Container>
        </section>

        <section
          id="manifesto"
          className="relative isolate overflow-hidden scroll-mt-[calc(var(--templio-nav-height,4.5rem)+1.5rem)] border-b border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_42%,#f4f4f5_100%)] dark:bg-[linear-gradient(180deg,#09090b_0%,#000000_48%,#09090b_100%)]"
          />
          <div
            aria-hidden
            className="templio-grid-texture absolute inset-0 -z-10 opacity-70 dark:opacity-45"
          />
          <div
            aria-hidden
            className="templio-grain-texture absolute inset-0 -z-10 opacity-[0.16] mix-blend-multiply dark:opacity-[0.22] dark:mix-blend-screen"
          />
          <Container size="lg" className="py-18 sm:py-24 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-start lg:gap-16"
            >
              <div className="min-w-0">
                <SectionKicker>{t("manifesto.kicker")}</SectionKicker>
                <h2 className="mt-6 max-w-[12.5ch] text-4xl leading-[1.02] tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white">
                  <EmphasisText
                    text={t("manifesto.heading")}
                    highlight={t("manifesto.headingHighlight")}
                  />
                </h2>
              </div>

              <div className="relative min-w-0 lg:pl-10">
                <div
                  aria-hidden
                  className="absolute bottom-1 top-1 left-0 hidden w-px bg-zinc-200 lg:block dark:bg-white/10"
                />
                <div className="space-y-8">
                  <p className="text-xl leading-8 text-zinc-700 sm:text-2xl sm:leading-9 dark:text-zinc-200">
                    {t("manifesto.body1")}
                  </p>
                  <p className="border-t border-zinc-200 pt-6 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:border-white/10 dark:text-zinc-300">
                    {t("manifesto.body2")}
                  </p>
                  <p className="border-t border-zinc-200 pt-5 text-sm leading-6 text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    <span className="italic">{t("manifesto.finePrint")}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        <section
          id="work"
          className="scroll-mt-[calc(var(--templio-nav-height,4.5rem)+1.5rem)] border-b border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-black"
        >
          <Container size="lg" className="py-20 md:py-28 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="flex justify-center">
                <SectionKicker>{t("showcase.kicker")}</SectionKicker>
              </div>
              <h2 className="mt-5 text-4xl leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
                <EmphasisText
                  text={t("showcase.heading")}
                  highlight={t("showcase.headingHighlight")}
                />
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
                {t("showcase.subheading")}
              </p>
            </motion.div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {SHOWCASE_SITES.map((site, index) => (
                <ShowcaseCard
                  key={site.href}
                  site={site}
                  name={tShowcaseSites(`${site.id}.name`)}
                  category={tShowcaseSites(`${site.id}.category`)}
                  description={tShowcaseSites(`${site.id}.description`)}
                  index={index}
                />
              ))}
            </div>

            <p className="mx-auto mt-10 max-w-xl text-center text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
              {t("showcase.note")}
            </p>
          </Container>
        </section>

        <section
          id="pitch"
          className="scroll-mt-[calc(var(--templio-nav-height,4.5rem)+1.5rem)] bg-white dark:bg-zinc-950"
        >
          <Container
            size="lg"
            className="grid gap-10 py-20 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] md:items-start md:py-28 lg:py-32"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="min-w-0 max-w-xl"
            >
              <SectionKicker>{t("pitchSection.kicker")}</SectionKicker>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white">
                {t("pitchSection.heading")}
              </h2>
              <p className="mt-6 text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
                {t("pitchSection.bodyBeforeLink")}{" "}
                <a
                  href="https://www.ayush.im"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition hover:text-lime-700 dark:text-white dark:decoration-white/30 dark:hover:text-lime-200"
                >
                  ayush.im
                </a>
                {t("pitchSection.bodyAfterLink")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative min-w-0"
            >
              <form
                className="relative rounded-lg border border-zinc-200 bg-zinc-50 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-4 dark:border-white/10 dark:bg-black dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
                onSubmit={step === "idea" ? handleNext : handleSubmit}
              >
                <div className="space-y-3">
                  <motion.div
                    layout
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          className="flex min-h-16 items-center justify-center p-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <motion.div
                            className="h-5 w-5 rounded-full border-2 border-zinc-400 border-t-transparent dark:border-white dark:border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </motion.div>
                      ) : isSubmitted ? (
                        <motion.div
                          key="submitted"
                          className="flex min-h-16 items-center gap-2 p-4 text-left"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex-1 text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
                            {submittedEmail}
                          </div>
                        </motion.div>
                      ) : step === "idea" ? (
                        <motion.div
                          key="idea"
                          className="flex items-end gap-2 p-2 sm:p-2.5"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                        >
                          <textarea
                            ref={ideaInputRef}
                            placeholder={tForm("ideaPlaceholder")}
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            onKeyDown={handleIdeaKeyDown}
                            rows={1}
                            suppressHydrationWarning
                            className="field-sizing-content max-h-60 min-h-11 flex-1 resize-none self-center bg-transparent px-3 py-2.5 text-left text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 focus:outline-none sm:text-base dark:text-white dark:placeholder:text-zinc-500"
                          />
                          <button
                            type="submit"
                            disabled={!idea.trim()}
                            aria-label={tForm("nextLabel")}
                            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white transition hover:bg-lime-600 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 dark:bg-white dark:text-zinc-950 dark:hover:bg-lime-200 dark:disabled:bg-white/10 dark:disabled:text-zinc-600"
                          >
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="email"
                          className="flex items-center gap-2 p-2 sm:p-2.5"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                        >
                          <input
                            ref={emailInputRef}
                            type="email"
                            placeholder={tForm("emailPlaceholder")}
                            className="min-h-11 flex-1 bg-transparent px-3 py-2.5 text-left text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 focus:outline-none sm:text-base dark:text-white dark:placeholder:text-zinc-500"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            suppressHydrationWarning
                          />
                          <button
                            type="submit"
                            aria-label={tForm("submitLabel")}
                            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white transition hover:bg-lime-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-lime-200"
                          >
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  {(formMessage || step === "email") && (
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {formMessage && <span>{formMessage}</span>}
                      {step === "email" && !isLoading && !isSubmitted && (
                        <button
                          type="button"
                          onClick={handleEditIdea}
                          className="text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-white"
                        >
                          {tForm("editIdeaLabel")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </Container>
        </section>
      </main>

      <div className="border-t border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950">
        <Footer />
      </div>
    </div>
  );
}
