"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Toaster } from "sonner";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToaster() {
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const sonnerTheme = isClient && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      theme={sonnerTheme}
    />
  );
}
