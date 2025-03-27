import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "next-themes";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Tabanok",
    default: "Tabanok rmcam", // a default is required when creating a template
  },
};

export default async function RootLayout({
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <main className="container mx-auto ">{children}</main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
