"use client";

import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
    >
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <main className="container mx-auto pt-5">{children}</main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
