"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Separate component to handle Clerk theme dynamically
export function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme(); // Get theme safely

  // Ensure there is always a valid theme (fallback to "light")
  const activeTheme = theme || resolvedTheme || "light";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: activeTheme === "dark" ? dark : undefined, // Use default theme safely
      }}
    >
      {children}
      <ThemedToaster />
    </ClerkProvider>
  );
}

function ThemedToaster() {
  const { theme } = useTheme(); // Get the current theme

  return (
    <Toaster
      theme={theme === "dark" ? "dark" : "light"} // Set the theme dynamically
      richColors // Enable rich colors
    />
  );
}