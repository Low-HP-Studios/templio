import { v } from "convex/values";
import { mutation, action } from "./_generated/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WaitlistWelcome from "../emails/WaitlistWelcome";

export const join = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    const existingEntry = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingEntry) {
      return { success: true, alreadyExists: true, id: existingEntry._id };
    }

    const waitlistId = await ctx.db.insert("waitlist", {
      email: args.email,
      createdAt: Date.now(),
      status: "active",
    });

    return { success: true, alreadyExists: false, id: waitlistId };
  },
});

export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const resend = new Resend(resendApiKey);

    const emailHtml = await render(WaitlistWelcome({ email: args.email }));

    try {
      const { data, error } = await resend.emails.send({
        from: "Templio <hello@templio.app>",
        to: args.email,
        subject: "Templio beta invite request received",
        html: emailHtml,
      });

      if (error) {
        console.error("Failed to send email:", error);
        if (
          error.name === "validation_error" &&
          error.message?.includes("testing emails")
        ) {
          throw new Error(
            "Email service is in test mode. Contact developer to enable production emails."
          );
        }
        throw new Error("Failed to send welcome email");
      }

      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send welcome email");
    }
  },
});
