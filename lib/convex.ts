import { ConvexReactClient } from "convex/react";

function convexUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  }
  return url;
}

export const convex = new ConvexReactClient(convexUrl());
