"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAction, useMutation } from "convex/react";
import { toast, Toaster } from "sonner";

import { api } from "@/convex/_generated/api";
import {
  FORM_COPY,
  HERO_COPY,
  MANIFESTO,
  SHOWCASE_COPY,
  SHOWCASE_NOTE,
  SHOWCASE_SITES,
} from "@/constants";
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
  const regex = new RegExp(`(${highlight})`, "i");
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

export default function LandingPage() {
  const [step, setStep] = useState<Step>("idea");
  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const joinWaitlist = useMutation(api.waitlist.join);
  const sendWelcomeEmail = useAction(api.waitlistEmail.sendWelcomeEmail);

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
        toast.warning(FORM_COPY.alreadyExistsMessage);
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
      toast.success("Pitch received.");
    } catch (error) {
      setStatus("error");
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to send your pitch. Please try again.";

      if (errorMsg.includes("Invalid email")) {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to send your pitch. Please try again.");
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

  const baseIdleMessage =
    step === "email" ? FORM_COPY.emailStepMessage : FORM_COPY.idleMessage;

  const formMessage =
    status === "success"
      ? FORM_COPY.successMessage
      : status === "already_exists"
        ? FORM_COPY.alreadyExistsMessage
        : baseIdleMessage;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Toaster position="bottom-right" richColors closeButton theme="dark" />

      <section className="relative isolate flex min-h-screen w-full flex-col overflow-hidden">
        <VideoBackground src="/clouds-bg.mp4" poster="/preview-clouds.png" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.32)_45%,transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-12%] top-1/3 z-[1] h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-sky-500/10 blur-[140px]"
        />

        <Navbar />

        <div className="relative z-10 flex w-full flex-1 items-start pb-10 pt-6 sm:pb-14 sm:pt-10 md:pb-16 lg:items-center lg:pb-20 lg:pt-10">
          <Container
            size="lg"
            className="grid gap-8 py-4 sm:gap-10 sm:py-6 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.78fr)] lg:items-center lg:gap-14 lg:py-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="max-w-3xl text-left"
            >
              <motion.div
                className="mb-5 flex items-center gap-3 sm:mb-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span aria-hidden className="h-px w-8 bg-sky-200/50 sm:w-10" />
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-sky-200/80 sm:text-xs">
                  A micro-studio for thoughtful websites
                </span>
              </motion.div>

              <div className="space-y-5 sm:space-y-6 lg:space-y-7">
                <div className="relative">
                  <motion.h1
                    className="font-display text-[4.5rem] leading-[0.92] text-white sm:text-8xl md:text-9xl lg:text-[8.5rem] xl:text-[10rem]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                  >
                    Templio
                  </motion.h1>
                  <motion.svg
                    aria-hidden
                    viewBox="0 0 320 24"
                    className="mt-1 ml-1 h-4 w-40 text-white/65 sm:mt-1.5 sm:ml-2 sm:h-5 sm:w-56 md:ml-3 md:h-6 md:w-72"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                  >
                    <motion.path
                      d="M2 14 C 40 4, 90 22, 150 12 S 260 4, 316 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 1.4,
                        delay: 0.95,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.circle
                      cx="316"
                      cy="16"
                      r="2"
                      fill="currentColor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: 2.25 }}
                    />
                  </motion.svg>
                </div>

                <div className="max-w-2xl space-y-5 sm:space-y-6">
                  <motion.p
                    className="max-w-[14ch] text-balance text-[2.1rem] leading-[1.05] text-zinc-100 sm:max-w-none sm:text-3xl md:text-[2.6rem] lg:text-[2.9rem]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                  >
                    Custom websites for people who still{" "}
                    <span className="font-display text-[1.2em] leading-none text-sky-100">
                      care
                    </span>{" "}
                    how the web{" "}
                    <span className="font-display text-[1.2em] leading-none text-sky-100">
                      feels
                    </span>
                    .
                  </motion.p>
                  <motion.p
                    className="flex max-w-[28rem] items-start gap-3 text-base leading-7 text-zinc-400 sm:max-w-xl sm:text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                  >
                    <span aria-hidden className="mt-0.5 shrink-0 text-zinc-500">
                      →
                    </span>
                    <span>{HERO_COPY.subline}</span>
                  </motion.p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative w-full max-w-xl lg:justify-self-end"
            >
              <motion.div
                className="mb-3 flex items-center justify-between px-1"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center gap-2.5">
                  <span aria-hidden className="h-px w-5 bg-sky-200/50" />
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-sky-200/80 sm:text-xs">
                    The pitch
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.28em] text-zinc-500 sm:text-xs">
                  <span className="h-[3px] w-5 rounded-full bg-white/95" />
                  <span
                    className={`h-[3px] w-5 rounded-full transition-colors duration-300 ${
                      step === "email" || isLoading || isSubmitted
                        ? "bg-white/95"
                        : "bg-white/25"
                    }`}
                  />
                  <span className="ml-1 tabular-nums">
                    {step === "idea" && !isSubmitted ? "01" : "02"} / 02
                  </span>
                </div>
              </motion.div>

              <motion.form
                className="relative rounded-lg border border-white/10 bg-zinc-950/75 p-3 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-4 md:p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                onSubmit={step === "idea" ? handleNext : handleSubmit}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-white/60"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-white/60"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-white/60"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-white/60"
                />
                <div className="space-y-4">
                  <motion.div
                    layout
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative overflow-hidden rounded-lg border border-white/10 bg-black/35 shadow-xl shadow-black/30 backdrop-blur-md"
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
                            placeholder={FORM_COPY.ideaPlaceholder}
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            onKeyDown={handleIdeaKeyDown}
                            rows={1}
                            className="field-sizing-content max-h-60 min-h-[2.75rem] flex-1 resize-none self-center bg-transparent px-3 py-2.5 text-left text-sm leading-6 text-white placeholder:text-zinc-500 focus:outline-none sm:text-base"
                            autoFocus
                          />
                          <button
                            type="submit"
                            disabled={!idea.trim()}
                            aria-label={FORM_COPY.nextLabel}
                            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-zinc-500"
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
                            type="email"
                            placeholder={FORM_COPY.emailPlaceholder}
                            className="min-h-[2.75rem] flex-1 bg-transparent px-3 py-2.5 text-left text-sm leading-6 text-white placeholder:text-zinc-500 focus:outline-none sm:text-base"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="submit"
                            aria-label={FORM_COPY.submitLabel}
                            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 transition-all hover:bg-zinc-100"
                          >
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left text-sm leading-relaxed text-zinc-400">
                    <span>{formMessage}</span>
                    {step === "email" && !isLoading && !isSubmitted && (
                      <button
                        type="button"
                        onClick={handleEditIdea}
                        className="text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        {FORM_COPY.editIdeaLabel}
                      </button>
                    )}
                  </div>
                </div>
              </motion.form>

              <motion.div
                className="mt-4 flex items-center gap-2.5 px-1 text-[0.68rem] uppercase tracking-[0.24em] text-zinc-400 sm:text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </span>
                <span>Open for pitches · I read every one</span>
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </section>

      <section className="relative z-10 bg-black">
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
                § 01 &mdash; {MANIFESTO.kicker}
              </p>
            </div>
            <h2 className="text-3xl leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              <EmphasisText text={MANIFESTO.heading} highlight="template" />
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-zinc-300 sm:text-lg md:text-xl">
              <p>{MANIFESTO.body1}</p>
              <p>{MANIFESTO.body2}</p>
            </div>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-zinc-500">
              <span aria-hidden className="mt-[0.15em] shrink-0">
                &mdash;
              </span>
              <span className="italic">{MANIFESTO.finePrint}</span>
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="relative z-10 bg-black">
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
                § 02 &mdash; {SHOWCASE_COPY.kicker}
              </p>
              <span aria-hidden className="h-px w-8 bg-sky-200/40 sm:w-10" />
            </div>
            <h2 className="text-3xl leading-[1.15] text-white sm:text-4xl md:text-5xl">
              <EmphasisText text={SHOWCASE_COPY.heading} highlight="pitch" />
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
              {SHOWCASE_COPY.subheading}
            </p>
          </motion.div>

          <div className="grid gap-4 text-left sm:gap-5 md:grid-cols-2">
            {SHOWCASE_SITES.map((site, index) => (
              <motion.a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-zinc-900/70"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/80">
                      {String(index + 1).padStart(2, "0")} &mdash; Built with
                      Templio
                    </p>
                    <span aria-hidden className="h-px flex-1 bg-white/10" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {site.name}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">
                    {site.category}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">
                    {site.description}
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
                      Visit live site
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
              {SHOWCASE_NOTE}
            </p>
            <span aria-hidden className="h-px w-8 bg-zinc-600/50 sm:w-10" />
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
