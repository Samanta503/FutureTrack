"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/courses", label: "Courses" },
];

export function SiteNavbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070820]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#4f5bff]/40 bg-[#0f143c] shadow-[0_0_30px_rgba(79,91,255,0.35)]">
            <span className="h-3 w-3 rotate-45 rounded-sm bg-gradient-to-br from-[#7f8dff] to-[#89f0ff]" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">FutureTrack</p>
            <p className="text-xs text-white/60">Career Growth Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="text-sm text-white/80">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-[#5864ff] to-[#62dcff] px-4 py-2 text-sm font-semibold text-[#090b26] shadow-[0_8px_24px_rgba(98,220,255,0.25)] transition hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
