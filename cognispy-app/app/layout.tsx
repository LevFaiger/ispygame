import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CogniSpy - Memory & Thinking Activities",
  description: "Cognitive Stimulation Therapy games for memory and thinking exercises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-outfit antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
