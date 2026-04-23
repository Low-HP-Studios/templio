import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const join = mutation({
  args: {
    email: v.string(),
    idea: v.optional(v.string()),
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
      if (args.idea && args.idea !== existingEntry.idea) {
        await ctx.db.patch(existingEntry._id, { idea: args.idea });
      }
      return { success: true, alreadyExists: true, id: existingEntry._id };
    }

    const waitlistId = await ctx.db.insert("waitlist", {
      email: args.email,
      idea: args.idea,
      createdAt: Date.now(),
      status: "active",
    });

    return { success: true, alreadyExists: false, id: waitlistId };
  },
});
