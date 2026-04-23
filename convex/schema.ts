import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),
  waitlist: defineTable({
    email: v.string(),
    idea: v.optional(v.string()),
    createdAt: v.number(),
    status: v.optional(v.string()),
  }).index("by_email", ["email"]),
});
