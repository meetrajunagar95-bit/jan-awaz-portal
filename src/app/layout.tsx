import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jan Awaz Portal | Citizen Voice & Public Grievance Redressal",
  description:
    "Official public grievance portal for citizen voice and municipal issue resolution. Lodge complaints for roads, water, electricity, sanitation, and track live status.",
  keywords: [
    "Jan Awaz",
    "Citizen Grievance",
    "Public Portal",
    "Complaint Redressal",
    "Bhavnagar Municipal",
    "Polytechnic Project",
    "Civic Voice",
  ],
  authors: [
    {
      name: "Student, Diploma IT (Sem 5), Sir Bhavsinhji Polytechnic Institute",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
        <Suspense fallback={<div className="h-16 md:h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
