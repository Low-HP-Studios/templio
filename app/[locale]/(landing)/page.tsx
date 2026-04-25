"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAction, useMutation } from "convex/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { SHOWCASE_SITES } from "@/constants";
import {
  Container,
  Footer,
  Navbar,
  ThemeToaster,
  VideoBackground,
} from "@/components/ui";

type Step = "idea" | "email";
type Status = "idle" | "loading" | "success" | "already_exists" | "error";

const RAIL_INSET =
  "pl-[max(1rem,calc(50vw-45rem+1rem))] pr-[max(1rem,calc(50vw-45rem+1rem))] sm:pl-[max(1.5rem,calc(50vw-45rem+1.5rem))] sm:pr-[max(1.5rem,calc(50vw-45rem+1.5rem))] lg:pl-[max(2rem,calc(50vw-45rem+2rem))] lg:pr-[max(2rem,calc(50vw-45rem+2rem))]";

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

function RailChevronLeft({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M12.5 5.5L7.5 10l5 4.5" />
    </svg>
  );
}

function RailChevronRight({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M7.5 5.5L12.5 10l-5 4.5" />
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
              className="font-display text-[1.15em] leading-none text-sky-700 dark:text-sky-100"
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

function ShowcasePreviewCard({
  site,
  name,
  category,
  compact = false,
}: {
  site: (typeof SHOWCASE_SITES)[number];
  name: string;
  category: string;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={site.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative isolate shrink-0 rounded-lg outline-none before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:border before:border-lime-300/45 before:opacity-0 before:transition-all before:duration-500 before:ease-out before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:border after:border-lime-300/30 after:opacity-0 after:transition-all after:duration-500 after:ease-out after:content-[''] hover:before:-translate-x-3 hover:before:translate-y-3 hover:before:opacity-100 hover:after:-translate-x-4 hover:after:translate-y-5 hover:after:opacity-100 focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:before:-translate-x-3 focus-visible:before:translate-y-3 focus-visible:before:opacity-100 focus-visible:after:-translate-x-4 focus-visible:after:translate-y-5 focus-visible:after:opacity-100 ${
        compact ? "w-[22rem] sm:w-[28rem]" : "w-full"
      }`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        reduceMotion ? undefined : { y: -5, width: compact ? "32rem" : "100%" }
      }
      whileFocus={
        reduceMotion ? undefined : { y: -5, width: compact ? "32rem" : "100%" }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="relative aspect-[1.75] overflow-hidden rounded-lg border border-white/30 bg-zinc-950 shadow-2xl shadow-black/50 transition-colors duration-300 group-hover:border-lime-300 group-focus-visible:border-lime-300">
        <Image
          src={site.preview}
          alt={`${name} website preview`}
          fill
          sizes={compact ? "512px" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-black/5 transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(217,249,157,0.34),transparent_28%),linear-gradient(115deg,rgba(14,165,233,0.18),transparent_52%)] opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-lime-300 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-300/75">
            {category}
          </p>
          <h3 className="mt-1 truncate text-lg font-semibold leading-tight text-white">
            {name}
          </h3>
          <p className="mt-2 max-w-44 translate-y-2 text-xs font-medium text-zinc-200 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {site.urlLabel}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
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
  const showcaseRailRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const syncShowcaseArrows = useCallback(() => {
    const el = showcaseRailRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(max > 2 && scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const el = showcaseRailRef.current;
    if (!el) return;
    syncShowcaseArrows();
    const onScroll = () => syncShowcaseArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => syncShowcaseArrows());
    ro.observe(el);
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", onScroll);
    };
  }, [syncShowcaseArrows]);

  const scrollShowcase = (dir: -1 | 1) => {
    const el = showcaseRailRef.current;
    if (!el) return;
    const step = Math.max(220, Math.round(el.clientWidth * 0.75));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <ThemeToaster />
      <Navbar includeSpacer={false} />

      <section
        id="home"
        className="relative isolate flex max-h-screen min-h-[720px] w-full flex-col overflow-hidden scroll-mt-28 bg-black"
      >
        <div aria-hidden className="h-27 shrink-0" />
        <VideoBackground src="/clouds-bg.mp4" poster="/preview-clouds.png" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.76)_24%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0.48)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-56 bg-linear-to-t from-black via-black/55 to-transparent"
        />

        <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-stretch pb-4 pt-4 sm:pb-6 sm:pt-6 lg:pb-8 lg:pt-8">
          <Container
            size="xl"
            className="flex min-h-0 flex-col justify-center gap-6 py-2 sm:gap-8 md:gap-10 lg:gap-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="max-w-2xl text-left lg:max-w-3xl"
            >
              <motion.h1
                className="max-w-[12ch] text-balance text-4xl font-semibold leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                {t("hero.h1")}
              </motion.h1>
              <motion.p
                className="mt-4 max-w-xl text-sm leading-6 text-zinc-200 sm:mt-5 sm:text-base sm:leading-7"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                {t("hero.sub")}
              </motion.p>
              <motion.a
                href="#pitch"
                className="mt-5 inline-flex items-center gap-3 rounded-md bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-4 focus-visible:ring-offset-black sm:mt-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                {t("hero.cta")}
                <ArrowRightIcon className="h-4 w-4" />
              </motion.a>
            </motion.div>
          </Container>
          <div className="mt-6 min-h-0 w-full min-w-0 sm:mt-8 md:mt-10">
            <motion.div
              className="mx-auto mb-3 flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <h2 className="min-w-0 flex-1 text-base font-semibold text-white sm:text-lg">
                {t("hero.stripTitle")}
              </h2>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => scrollShowcase(-1)}
                  disabled={!canScrollLeft}
                  aria-label={t("hero.scrollPrevious")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white transition-[background-color,opacity,box-shadow] hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_#0696d7] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_#0696d7] disabled:pointer-events-none disabled:opacity-35 sm:h-10 sm:w-10"
                >
                  <RailChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollShowcase(1)}
                  disabled={!canScrollRight}
                  aria-label={t("hero.scrollNext")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white transition-[background-color,opacity,box-shadow] hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_#0696d7] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_#0696d7] disabled:pointer-events-none disabled:opacity-35 sm:h-10 sm:w-10"
                >
                  <RailChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
            <div className="relative w-full min-w-0">
              <div
                ref={showcaseRailRef}
                className={`flex w-full min-w-0 gap-8 overflow-x-auto overflow-y-visible py-7 [scrollbar-width:none] sm:gap-10 [&::-webkit-scrollbar]:hidden ${RAIL_INSET}`}
              >
                {SHOWCASE_SITES.map((site) => (
                  <ShowcasePreviewCard
                    key={site.href}
                    site={site}
                    name={tShowcaseSites(`${site.id}.name`)}
                    category={tShowcaseSites(`${site.id}.category`)}
                    compact
                  />
                ))}
              </div>
              {canScrollLeft && (
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.9)_32%,rgba(0,0,0,0.4)_70%,transparent_100%)] sm:w-24 md:w-32"
                  aria-hidden
                />
              )}
              {canScrollRight && (
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-[linear-gradient(270deg,#000_0%,rgba(0,0,0,0.9)_32%,rgba(0,0,0,0.4)_70%,transparent_100%)] sm:w-24 md:w-32"
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="manifesto"
        className="relative z-10 scroll-mt-32 bg-zinc-50 dark:bg-black"
      >
        <Container size="md" className="py-24 md:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-8 text-left"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-sky-500/35 sm:w-10 dark:bg-sky-200/50"
              />
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-sky-700/90 sm:text-xs dark:text-sky-200/80">
                {t("manifesto.kickerLine")}
              </p>
            </div>
            <h2 className="text-3xl leading-[1.15] text-zinc-950 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
              <EmphasisText
                text={t("manifesto.heading")}
                highlight={t("manifesto.headingHighlight")}
              />
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-zinc-600 sm:text-lg md:text-xl dark:text-zinc-300">
              <p>{t("manifesto.body1")}</p>
              <p>{t("manifesto.body2")}</p>
            </div>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-zinc-500">
              <span aria-hidden className="mt-[0.15em] shrink-0">
                &mdash;
              </span>
              <span className="italic">{t("manifesto.finePrint")}</span>
            </p>
          </motion.div>
        </Container>
      </section>

      <section
        id="work"
        className="relative z-10 scroll-mt-32 bg-zinc-50 dark:bg-black"
      >
        <Container size="lg" className="space-y-10 py-16 md:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-sky-500/35 sm:w-10 dark:bg-sky-200/40"
              />
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-sky-700/90 sm:text-xs dark:text-sky-200/80">
                {t("showcase.kickerLine")}
              </p>
              <span
                aria-hidden
                className="h-px w-8 bg-sky-500/35 sm:w-10 dark:bg-sky-200/40"
              />
            </div>
            <h2 className="text-3xl leading-[1.15] text-zinc-950 sm:text-4xl md:text-5xl dark:text-white">
              <EmphasisText
                text={t("showcase.heading")}
                highlight={t("showcase.headingHighlight")}
              />
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base md:text-lg dark:text-zinc-400">
              {t("showcase.subheading")}
            </p>
          </motion.div>

          <div className="grid gap-4 text-left sm:gap-5 md:grid-cols-2">
            {SHOWCASE_SITES.map((site, index) => (
              <motion.a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/80 backdrop-blur-sm transition-colors hover:border-zinc-300 hover:bg-white dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-white/25 dark:hover:bg-zinc-900/70"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="relative aspect-[1.75] overflow-hidden border-b border-zinc-200/80 dark:border-white/10">
                  <Image
                    src={site.preview}
                    alt={`${tShowcaseSites(`${site.id}.name`)} website preview`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-900/50 via-transparent to-zinc-900/5 dark:from-black/70 dark:via-transparent dark:to-black/10" />
                </div>
                <div className="absolute inset-0 bg-linear-to-br from-sky-500/8 via-transparent to-zinc-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-sky-400/10 dark:to-white/5" />
                <div className="relative flex h-full flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-700/90 dark:text-sky-200/80">
                      {t("showcase.builtWith", {
                        n: String(index + 1).padStart(2, "0"),
                      })}
                    </p>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-zinc-200/90 dark:bg-white/10"
                    />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-zinc-950 dark:text-white">
                    {tShowcaseSites(`${site.id}.name`)}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">
                    {tShowcaseSites(`${site.id}.category`)}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {tShowcaseSites(`${site.id}.description`)}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4 text-sm font-medium">
                    <span className="flex items-center gap-2 text-zinc-900 dark:text-white">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                      </span>
                      <span>{site.urlLabel}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500 transition-colors group-hover:text-zinc-900 dark:group-hover:text-white">
                      {t("showcase.visitLive")}
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden
              className="h-px w-8 bg-zinc-300 sm:w-10 dark:bg-zinc-600/50"
            />
            <p className="text-center text-[0.68rem] uppercase tracking-[0.28em] text-zinc-500 sm:text-sm">
              {t("showcase.note")}
            </p>
            <span
              aria-hidden
              className="h-px w-8 bg-zinc-300 sm:w-10 dark:bg-zinc-600/50"
            />
          </div>
        </Container>
      </section>

      <section
        id="pitch"
        className="relative z-10 scroll-mt-32 bg-zinc-50 dark:bg-black"
      >
        <Container
          size="lg"
          className="grid gap-10 py-20 md:grid-cols-[minmax(0,0.8fr)_minmax(340px,1fr)] md:items-start md:py-28 lg:py-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-lime-500/50 sm:w-10 dark:bg-lime-300/60"
              />
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-lime-700 sm:text-xs dark:text-lime-300">
                {t("pitchSection.kicker")}
              </p>
            </div>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl md:text-6xl dark:text-white">
              {t("pitchSection.heading")}
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-500 sm:text-lg dark:text-zinc-400">
              {t("pitchSection.bodyBeforeLink")}
              <a
                href="https://www.ayush.im"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-lime-600 dark:text-white dark:decoration-white/30 dark:hover:text-lime-200"
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
            className="relative"
          >
            <form
              className="relative rounded-lg border border-zinc-200/90 bg-white/90 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-4 dark:border-white/10 dark:bg-zinc-950/75 dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
              onSubmit={step === "idea" ? handleNext : handleSubmit}
            >
              <div className="space-y-3">
                <motion.div
                  layout
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative overflow-hidden rounded-md border border-zinc-200/90 bg-zinc-50/90 shadow-lg shadow-zinc-400/10 backdrop-blur-md dark:border-white/10 dark:bg-black/45 dark:shadow-black/25"
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
                          className="field-sizing-content max-h-60 min-h-11 flex-1 resize-none self-center bg-transparent px-3 py-2.5 text-left text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 focus:outline-none sm:text-base dark:text-white dark:placeholder:text-zinc-500"
                        />
                        <button
                          type="submit"
                          disabled={!idea.trim()}
                          aria-label={tForm("nextLabel")}
                          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 transition-all hover:bg-lime-200 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-zinc-500"
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
                        />
                        <button
                          type="submit"
                          aria-label={tForm("submitLabel")}
                          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 transition-all hover:bg-lime-200"
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
                        className="text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-white"
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

      <Footer />
    </div>
  );
}
