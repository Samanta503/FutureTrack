import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#060718]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <h3 className="text-lg font-semibold text-white">FutureTrack</h3>
          <p className="mt-3 text-sm text-white/65">
            Helping students and job-seekers build career confidence with data-driven guidance.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link href="/">Landing</Link></li>
            <li><Link href="/jobs">Jobs</Link></li>
            <li><Link href="/courses">Courses</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>support@futuretrack.app</li>
            <li>+91 90000 00000</li>
            <li className="text-white/50">LinkedIn • X • Instagram</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
