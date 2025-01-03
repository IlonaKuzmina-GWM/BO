import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/stores/constants";
import { ThemeProvider } from "next-themes";
import { cn } from "@/utils/utils";
import { FetchProvider } from "@/components/Providers";
import { StoreProvider } from "@/stores/StoreProvider";
import AllertWrapper from "@/components/AllertWrapper";
import { TransactionProvider } from "@/context/TransactionContext";
import AppProviders from "@/components/shared/AppProviders";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body
        className={cn(
          "overflow-hidden antialiased",
          fontHeading.variable,
          fontBody.variable,
        )}
      >
        <AppProviders>
          {children}
          <AllertWrapper />
        </AppProviders>
      </body>
    </html>
  );
}
