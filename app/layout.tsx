import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Chat",
  description: "Chat with any model through AgentRouter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
