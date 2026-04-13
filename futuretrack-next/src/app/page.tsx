import Link from "next/link";
import { DashboardRecommendations } from "@/components/common/dashboard-recommendations";
import { SectionTitle } from "@/components/common/section-title";
import {
  featuredDomains,
  howItWorks,
  landingFeatures,
  testimonials,
} from "@/data/mock-data";

export default function Home() {
  return (
    <div className="space-y-14 pb-8 sm:space-y-20">
      <section className="rounded-[2rem] border border-white/10 bg-[#0a0d2f]/75 px-6 py-10 shadow-[0_0_80px_rgba(89,106,255,0.17)] backdrop-blur sm:px-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-[#9fb3ff]">Smart Career Development Platform</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              FutureTrack helps you discover the right career path, faster.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/75 sm:text-base">
              Build a strong profile, find best-fit jobs, identify skill gaps, and get practical course recommendations aligned with real market demand.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/jobs"
                className="rounded-full bg-gradient-to-r from-[#5766ff] to-[#63dcff] px-5 py-2.5 text-sm font-semibold text-[#070920]"
              >
                Get Started
              </Link>
              <Link
                href="/jobs"
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Explore Jobs
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-[#6f7dff]/30 bg-[#11174a]/85 p-5">
            <p className="text-xs uppercase tracking-wider text-[#b4c3ff]">Interactive Profile Builder</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Career Profile Health</h3>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-[#6675ff] to-[#64dfff]" />
            </div>
            <p className="mt-2 text-sm text-white/70">74% complete. Add one project and certifications to boost match score.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/75">Education</span>
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/75">Skills</span>
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/75">Experience</span>
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/75">Career Goals</span>
            </div>
            <button className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0a0e2f]">
              Generate and Download CV
            </button>
          </aside>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0d1239] p-4">
            <p className="text-2xl font-semibold text-[#9fb3ff]">10K+</p>
            <p className="mt-1 text-sm text-white/70">Students and job-seekers guided</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0d1239] p-4">
            <p className="text-2xl font-semibold text-[#9fb3ff]">87%</p>
            <p className="mt-1 text-sm text-white/70">Users improved match score in 30 days</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0d1239] p-4">
            <p className="text-2xl font-semibold text-[#9fb3ff]">350+</p>
            <p className="mt-1 text-sm text-white/70">Skill-focused course pathways</p>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Our Mission"
          title="Empower every learner to make career decisions with clarity"
          subtitle="FutureTrack combines profile intelligence, job matching, and market-backed guidance so users can confidently move from uncertainty to opportunity."
        />
      </section>

      <section className="space-y-6">
        <SectionTitle
          eyebrow="Features"
          title="Everything you need to grow your career"
          subtitle="From profile setup to recommendations, each module is designed to turn ambition into a practical action plan."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingFeatures.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-white/10 bg-[#0c1033] p-5">
              <div className="h-9 w-9 rounded-lg border border-[#6474ff]/50 bg-[#1b215f]" />
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-white/70">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="How It Works" title="A guided journey in four simple steps" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-white/10 bg-[#0c1033] p-5">
              <p className="text-sm font-semibold text-[#9fb3ff]">Step {index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="Career Domains" title="Explore trending roles and opportunities" />
        <div className="flex flex-wrap gap-3">
          {featuredDomains.map((domain) => (
            <span
              key={domain}
              className="rounded-full border border-white/15 bg-[#11174a] px-4 py-2 text-sm text-white/85"
            >
              {domain}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="Success Stories" title="Learners who transformed their career trajectory" />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-white/10 bg-[#0c1033] p-5">
              <p className="text-sm text-white/80">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-white">{item.name}</p>
              <p className="text-xs text-white/60">{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="Dashboard Recommendations" title="Your personalized growth queue" />
        <DashboardRecommendations />
      </section>
    </div>
  );
}
