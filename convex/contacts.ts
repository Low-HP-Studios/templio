import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const contactId = await ctx.db.insert("contacts", {
      name: args.name,
      email: args.email,
      message: args.message,
      createdAt: Date.now(),
    });
    return contactId;
  },
});
