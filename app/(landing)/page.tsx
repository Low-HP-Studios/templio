"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAction, useMutation } from "convex/react";
import { toast, Toaster } from "sonner";

import { api } from "@/convex/_generated/api";
import { SHOWCASE_NOTE, SHOWCASE_SITES } from "@/constants";
import { Container, Footer, Navbar, VideoBackground } from "@/components/ui";

type Status = "idle" | "loading" | "success" | "already_exists" | "error";

export default function LandingPage() {
  const [showBackground, setShowBackground] = useState(false);
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isFocused, setIsFocused] = useState(false);

  const joinWaitlist = useMutation(api.waitlist.join);
  const sendWelcomeEmail = useAction(api.waitlist.sendWelcomeEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setSubmittedEmail(email);

    try {
      const result = await joinWaitlist({ email });

      if (result.alreadyExists) {
        setStatus("already_exists");
        toast.warning("This email is already on the beta invite list.");
        return;
      }

      try {
        await sendWelcomeEmail({ email });
      } catch (emailError) {
        console.warn("Failed to send welcome email:", emailError);
      }

      setStatus("success");
      toast.success("Invite request received.");
    } catch (error) {
      setStatus("error");
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to request a beta invite. Please try again.";

      if (errorMsg.includes("Invalid email")) {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to request a beta invite. Please try again.");
      }

      console.error(error);
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 3000);
    }
  };

  const hasInput = email.length > 0;
  const isIdle = status === "idle";
  const isLoading = status === "loading";
  const isSubmitted = status === "success" || status === "already_exists";
  const formMessage =
    status === "success"
      ? "Invite request received. We will reach out as new beta spots open."
      : status === "already_exists"
        ? "This email is already on the beta invite list."
        : "Request access to the invite-only beta. New websites are being onboarded in small batches.";

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Toaster position="bottom-right" richColors closeButton theme="dark" />
      {showBackground && (
        <VideoBackground
          src="/clouds-bg.mp4"
          poster="/preview-clouds.png"
          onPosterLoaded={() => {}}
        />
      )}

      <Navbar />

      <main className="relative z-10 flex w-full flex-1 items-center justify-center px-4 py-16 sm:py-20 md:py-24">
        <Container
          size="lg"
          className="space-y-10 text-center sm:space-y-12 md:space-y-16"
        >
          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-5 md:space-y-6">
            <motion.div
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-sky-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Invite-only beta
            </motion.div>
            <motion.h1
              className="font-display text-5xl leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Templio
            </motion.h1>
            <motion.p
              className="mx-auto max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg md:text-xl lg:text-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              An invite-only website builder for custom portfolios, studio
              sites, and community hubs.
            </motion.p>
            <motion.p
              className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base md:text-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Launch something that feels unmistakably yours. No templates, just
              your taste.
            </motion.p>
          </div>

          <motion.form
            className="mx-auto w-full max-w-md px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onAnimationComplete={() => setShowBackground(true)}
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <motion.div
                className="relative w-full overflow-hidden bg-zinc-900/80 backdrop-blur-md"
                animate={{
                  borderRadius:
                    isIdle && !hasInput && !isFocused ? "1rem" : "0.5rem",
                  maxWidth: isLoading ? "200px" : "100%",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <motion.div
                      className="h-6 w-6 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                ) : isSubmitted ? (
                  <div className="flex items-center gap-2 p-2 sm:p-2.5">
                    <div className="flex-1 px-2 py-2.5 text-sm text-zinc-500 sm:px-3 sm:py-2.5 sm:text-base md:px-3 md:py-2.5 md:text-lg">
                      {submittedEmail}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-2 sm:p-2.5">
                    <motion.div
                      className="flex-1"
                      layout
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <input
                        type="email"
                        placeholder="Request a beta invite"
                        className="w-full bg-transparent px-2 py-2.5 text-sm text-white transition-all duration-500 placeholder:text-zinc-500 focus:outline-none sm:px-3 sm:py-2.5 sm:text-base md:px-3 md:py-2.5 md:text-lg"
                        style={{
                          textAlign: hasInput || isFocused ? "left" : "center",
                        }}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isLoading || isSubmitted}
                      />
                    </motion.div>
                    <AnimatePresence mode="popLayout">
                      {(hasInput || isFocused) && (
                        <motion.button
                          type="submit"
                          className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-900 transition-all hover:scale-105 hover:bg-zinc-100"
                          aria-label="Request beta invite"
                          initial={{
                            opacity: 0,
                            scale: 0,
                            width: 0,
                            height: 0,
                            marginLeft: 0,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            width: 32,
                            height: 32,
                            marginLeft: 8,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0,
                            width: 0,
                            height: 0,
                            marginLeft: 0,
                          }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          layout
                        >
                          <Image
                            src="/bell.svg"
                            alt="Request invite"
                            width={16}
                            height={16}
                            className="h-4 w-4 sm:h-5 sm:w-5"
                          />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
              <p className="text-sm leading-relaxed text-zinc-500">
                {formMessage}
              </p>
            </div>
          </motion.form>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mx-auto w-full max-w-6xl space-y-8"
          >
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
                Built with Templio
              </p>
              <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
                Different websites. Same engine.
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
                From portfolios to studio launches to community hubs, Templio is
                built for websites that do not want to look mass-produced.
              </p>
            </div>

            <div className="grid gap-4 text-left sm:gap-5 md:grid-cols-2">
              {SHOWCASE_SITES.map((site, index) => (
                <motion.a
                  key={site.href}
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-zinc-900/70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col">
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/80">
                      Built with Templio
                    </p>
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
                      <span className="text-white">{site.urlLabel}</span>
                      <span className="text-zinc-500 transition-colors group-hover:text-white">
                        Visit live site
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
              {SHOWCASE_NOTE}
            </p>
          </motion.section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
