"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WaitlistWelcome from "../emails/WaitlistWelcome";

export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
    idea: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return { success: false, reason: "Email service not configured" };
    }

    const resend = new Resend(resendApiKey);

    try {
      const emailHtml = await render(
        WaitlistWelcome({ email: args.email, idea: args.idea })
      );

      const { data, error } = await resend.emails.send({
        from: "Templio <hello@templio.app>",
        to: args.email,
        subject: "Got your Templio pitch",
        html: emailHtml,
      });

      if (error) {
        console.error("Failed to send email:", error);
        if (
          error.name === "validation_error" &&
          error.message?.includes("testing emails")
        ) {
          return {
            success: false,
            reason:
              "Email service is in test mode. Contact developer to enable production emails.",
          };
        }
        return { success: false, reason: "Failed to send welcome email" };
      }

      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        reason:
          error instanceof Error
            ? error.message
            : "Failed to send welcome email",
      };
    }
  },
});
