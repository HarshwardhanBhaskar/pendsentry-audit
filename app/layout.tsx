import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SpendSentry | Free AI Spend Audit for Startups by Credex",
  description: "Stop burning cash on duplicate seats and billing traps. Analyze your startup's AI subscriptions and API spend with verified May 2026 rates in under 2 minutes.",
  keywords: ["AI Spend", "Cost Savings", "SaaS Audit", "Cursor Pro", "GitHub Copilot", "Claude Team minimum", "API credits", "Credex"],
  authors: [{ name: "Credex", url: "https://credex.rocks" }],
  openGraph: {
    title: "SpendSentry | Free AI Spend Audit for Startups",
    description: "Audit Cursor, Copilot, Claude, ChatGPT, and API budgets with exact, defensible May 2026 pricing. Save up to 30% today.",
    type: "website",
    siteName: "SpendSentry",
    images: [{ url: "https://spendsentry.com/og-card.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSentry | Free AI Spend Audit for Startups",
    description: "Audit Cursor, Copilot, Claude, ChatGPT, and API budgets with exact, defensible May 2026 pricing.",
    images: ["https://spendsentry.com/og-card.png"],
    creator: "@Credex"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

