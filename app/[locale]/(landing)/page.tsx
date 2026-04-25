"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useAction, useMutation } from "convex/react";
import { toast, Toaster } from "sonner";
import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { SHOWCASE_SITES } from "@/constants";
import { Container, Footer, Navbar, VideoBackground } from "@/components/ui";

type Step = "idea" | "email";
type Status = "idle" | "loading" | "success" | "already_exists" | "error";

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
              className="font-display text-[1.15em] leading-none text-sky-100"
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
  index,
  compact = false,
}: {
  site: (typeof SHOWCASE_SITES)[number];
  name: string;
  category: string;
  index: number;
  compact?: boolean;
}) {
  return (
    <motion.a
      href={site.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative shrink-0 overflow-hidden rounded-lg border border-white/35 bg-zinc-950 shadow-2xl shadow-black/50 ${
        compact ? "w-[18rem] sm:w-[22rem]" : "w-full"
      }`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45, delay: 0.45 + index * 0.08 }}
    >
      <div className="relative aspect-[1.75] overflow-hidden">
        <Image
          src={site.preview}
          alt={`${name} website preview`}
          fill
          sizes={compact ? "352px" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-300/75">
            {category}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-tight text-white">
            {name}
          </h3>
        </div>
        <p className="hidden shrink-0 text-sm text-zinc-300 sm:block">
          {site.urlLabel}
        </p>
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
      <Toaster position="bottom-right" richColors closeButton theme="dark" />
      <Navbar includeSpacer={false} />

      <section
        id="home"
        className="relative isolate flex max-h-screen min-h-[720px] w-full flex-col overflow-hidden bg-black scroll-mt-28"
      >
        <div aria-hidden className="h-[6.75rem] shrink-0" />
        <VideoBackground src="/clouds-bg.mp4" poster="/preview-clouds.png" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.76)_24%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0.48)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-56 bg-gradient-to-t from-black via-black/55 to-transparent"
        />

        <div className="relative z-10 flex min-h-0 w-full flex-1 items-stretch pb-4 pt-4 sm:pb-6 sm:pt-6 lg:pb-8 lg:pt-8">
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

            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mb-3 flex items-center justify-between gap-4"
              >
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  {t("hero.stripTitle")}
                </h2>
                <a
                  href="#pitch"
                  className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:inline-flex"
                >
                  {t("hero.stripCta")}
                </a>
              </motion.div>
              <div className="flex w-full gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SHOWCASE_SITES.map((site, index) => (
                  <ShowcasePreviewCard
                    key={site.href}
                    site={site}
                    name={tShowcaseSites(`${site.id}.name`)}
                    category={tShowcaseSites(`${site.id}.category`)}
                    index={index}
                    compact
                  />
                ))}
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section id="manifesto" className="relative z-10 scroll-mt-32 bg-black">
        <Container size="md" className="py-24 md:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-8 text-left"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-sky-200/50 sm:w-10" />
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-sky-200/80 sm:text-xs">
                {t("manifesto.kickerLine")}
              </p>
            </div>
            <h2 className="text-3xl leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              <EmphasisText
                text={t("manifesto.heading")}
                highlight={t("manifesto.headingHighlight")}
              />
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-zinc-300 sm:text-lg md:text-xl">
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

      <section id="work" className="relative z-10 scroll-mt-32 bg-black">
        <Container size="lg" className="space-y-10 py-16 md:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span aria-hidden className="h-px w-8 bg-sky-200/40 sm:w-10" />
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-sky-200/80 sm:text-xs">
                {t("showcase.kickerLine")}
              </p>
              <span aria-hidden className="h-px w-8 bg-sky-200/40 sm:w-10" />
            </div>
            <h2 className="text-3xl leading-[1.15] text-white sm:text-4xl md:text-5xl">
              <EmphasisText
                text={t("showcase.heading")}
                highlight={t("showcase.headingHighlight")}
              />
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-zinc-900/70"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="relative aspect-[1.75] overflow-hidden border-b border-white/10">
                  <Image
                    src={site.preview}
                    alt={`${tShowcaseSites(`${site.id}.name`)} website preview`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/80">
                      {t("showcase.builtWith", {
                        n: String(index + 1).padStart(2, "0"),
                      })}
                    </p>
                    <span aria-hidden className="h-px flex-1 bg-white/10" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {tShowcaseSites(`${site.id}.name`)}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">
                    {tShowcaseSites(`${site.id}.category`)}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">
                    {tShowcaseSites(`${site.id}.description`)}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4 text-sm font-medium">
                    <span className="flex items-center gap-2 text-white">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                      </span>
                      <span>{site.urlLabel}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500 transition-colors group-hover:text-white">
                      {t("showcase.visitLive")}
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-zinc-600/50 sm:w-10" />
            <p className="text-center text-[0.68rem] uppercase tracking-[0.28em] text-zinc-500 sm:text-sm">
              {t("showcase.note")}
            </p>
            <span aria-hidden className="h-px w-8 bg-zinc-600/50 sm:w-10" />
          </div>
        </Container>
      </section>

      <section id="pitch" className="relative z-10 scroll-mt-32 bg-black">
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
              <span aria-hidden className="h-px w-8 bg-lime-300/60" />
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-lime-300 sm:text-xs">
                {t("pitchSection.kicker")}
              </p>
            </div>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              {t("pitchSection.heading")}
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              {t("pitchSection.bodyBeforeLink")}
              <a
                href="https://www.ayush.im"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-lime-200"
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
              className="relative rounded-lg border border-white/10 bg-zinc-950/75 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-4"
              onSubmit={step === "idea" ? handleNext : handleSubmit}
            >
              <div className="space-y-3">
                <motion.div
                  layout
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative overflow-hidden rounded-md border border-white/10 bg-black/45 shadow-lg shadow-black/25 backdrop-blur-md"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        className="flex min-h-[4rem] items-center justify-center p-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <motion.div
                          className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
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
                        className="flex min-h-[4rem] items-center gap-2 p-4 text-left"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex-1 text-sm text-zinc-300 sm:text-base">
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
                          className="field-sizing-content max-h-60 min-h-[2.75rem] flex-1 resize-none self-center bg-transparent px-3 py-2.5 text-left text-sm leading-6 text-white placeholder:text-zinc-500 focus:outline-none sm:text-base"
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
                          className="min-h-[2.75rem] flex-1 bg-transparent px-3 py-2.5 text-left text-sm leading-6 text-white placeholder:text-zinc-500 focus:outline-none sm:text-base"
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
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-sm leading-relaxed text-zinc-400">
                    {formMessage && <span>{formMessage}</span>}
                    {step === "email" && !isLoading && !isSubmitted && (
                      <button
                        type="button"
                        onClick={handleEditIdea}
                        className="text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
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
