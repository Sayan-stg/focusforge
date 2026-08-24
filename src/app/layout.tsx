import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusForge — Deep Work & Habit Engine",
  description:
    "A productivity platform that fuses Pomodoro-style deep work timers with gamified habit tracking, streak shields, and competitive league leaderboards.",
  metadataBase: new URL("https://focusforge.vercel.app"),
  openGraph: {
    title: "FocusForge",
    description: "Deep Work & Habit Engine",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* General Sans + Satoshi from Fontshare — distinct, high-quality, no AI defaults */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=satoshi@700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
