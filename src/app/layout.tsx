import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Regular CRM | Salon Operations & Client Dashboard",
  description: "Next-generation salon CRM for booking management, revenue tracking, and client retention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-slate-900 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
