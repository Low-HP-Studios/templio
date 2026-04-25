"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, ThemeToaster } from "@/components/ui";
import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const createContact = useMutation(api.contacts.create);
  const sendNotificationEmail = useAction(
    api.contactsEmail.sendNotificationEmail
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await createContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      const emailResult = await sendNotificationEmail({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      if (!emailResult.success) {
        console.info("Notification email skipped:", emailResult.reason);
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      toast.success(t("successToast"));

      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      console.error(error);
      toast.error(t("errorToast"));
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-50 dark:bg-black">
      <ThemeToaster />
      <Container size="md" className="relative z-10 py-20 sm:py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl leading-tight text-zinc-950 sm:text-5xl md:text-6xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500 sm:text-xl dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl"
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-zinc-200/90 bg-white/90 p-6 backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-zinc-900/50"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-800 dark:text-white"
                >
                  {t("nameLabel")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500"
                  placeholder={t("namePlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-800 dark:text-white"
                >
                  {t("emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500"
                  placeholder={t("emailPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-zinc-800 dark:text-white"
                >
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full resize-none rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500"
                  placeholder={t("messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-zinc-950 px-6 py-3 font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {status === "loading" ? t("sending") : t("submit")}
              </button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-sm text-zinc-500"
          >
            {t("footerNote")}{" "}
            <a
              href="https://www.ayush.im"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline dark:text-sky-400"
            >
              ayush.im
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
