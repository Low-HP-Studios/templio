"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { toast, Toaster } from "sonner";
import { api } from "@/convex/_generated/api";

export default function ContactPage() {
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
      toast.success("Message sent successfully. We'll get back to you soon.");

      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      console.error(error);
      toast.error("Failed to send message. Please try again.");
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
    <div className="relative min-h-screen w-full bg-black">
      <Toaster position="bottom-right" richColors closeButton theme="dark" />
      <Container size="md" className="relative z-10 py-20 sm:py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Contact Templio
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl">
            Questions about a pitch, a site that&apos;s live, or just want to
            say hi? Drop a note.
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
            className="rounded-lg border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm sm:p-8"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full resize-none rounded-lg border border-white/10 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-zinc-900 transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Inquiry"}
              </button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-sm text-zinc-500"
          >
            Prefer a direct intro? Reach the founder via{" "}
            <a
              href="https://www.ayush.im"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              ayush.im
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
