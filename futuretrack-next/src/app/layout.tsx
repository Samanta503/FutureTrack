import type { Metadata } from "next";
import { Poppins, Sora } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/common/site-footer";
import { SiteNavbar } from "@/components/common/site-navbar";
import { AuthProvider } from "@/contexts/auth-context";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FutureTrack",
  description: "Smart career development platform for students and job-seekers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${sora.variable} h-full antialiased`}>
      <body className="futuretrack-bg min-h-full">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(104,120,255,0.23),_transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(30deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <AuthProvider>
          <SiteNavbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
