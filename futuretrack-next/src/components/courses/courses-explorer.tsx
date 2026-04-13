"use client";

import { useEffect, useMemo, useState } from "react";
import { courses, marketProTips, sampleUserProfile } from "@/data/mock-data";
import { Course, UserProfile } from "@/lib/types";
import { getApiUrl } from "@/lib/api";

export function CoursesExplorer() {
  const [coursesData, setCoursesData] = useState<Course[]>(courses);
  const [profile, setProfile] = useState<UserProfile>(sampleUserProfile);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, userRes] = await Promise.all([
          fetch(getApiUrl("/courses"), { cache: "no-store" }),
          fetch(getApiUrl("/users/1"), { cache: "no-store" }),
        ]);

        if (coursesRes.ok) {
          const payload = await coursesRes.json();
          if (payload?.data?.length) {
            setCoursesData(payload.data);
          }
        }

        if (userRes.ok) {
          const payload = await userRes.json();
          if (payload?.id) {
            setProfile(payload);
          }
        }
      } catch {
        // UI silently falls back to mock data when DB/API is not available.
      }
    };

    void loadData();
  }, []);

  const categories = [...new Set(coursesData.map((course) => course.category))];
  const domains = [...new Set(coursesData.map((course) => course.domain))];

  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      const joined = `${course.title} ${course.provider} ${course.skillsCovered.join(" ")}`.toLowerCase();

      return (
        (!query || joined.includes(query.toLowerCase())) &&
        (!category || course.category === category) &&
        (!level || course.level === level) &&
        (!domain || course.domain === domain)
      );
    });
  }, [coursesData, query, category, level, domain]);

  const recommendedCourses = filteredCourses.filter((course) =>
    course.skillsCovered.some((skill) =>
      profile.careerInterests.some((interest) =>
        `${skill} ${course.domain}`.toLowerCase().includes(interest.toLowerCase()),
      ),
    ),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search course, provider, skill"
            className="rounded-xl border border-white/15 bg-[#0f1235] px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#0f1235] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#0f1235] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">Any level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#0f1235] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All domains</option>
            {domains.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {filteredCourses.map((course) => (
            <article key={course.id} className="rounded-2xl border border-white/10 bg-[#0d1133] p-4">
              <p className="text-sm text-[#96a8ff]">{course.category}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{course.title}</h3>
              <p className="mt-1 text-sm text-white/70">{course.provider}</p>
              <p className="mt-2 text-sm text-white/65">
                {course.duration} • {course.level} • Rating {course.rating}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {course.skillsCovered.map((skill) => (
                  <span key={skill} className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/75">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Recommended For You</h3>
          <p className="mt-1 text-sm text-white/70">
            Based on your interests in {profile.careerInterests.join(", ")}.
          </p>
          <div className="mt-4 space-y-2">
            {(recommendedCourses.length ? recommendedCourses : filteredCourses.slice(0, 3)).map((course) => (
              <div key={course.id} className="rounded-xl border border-white/10 bg-[#0d1133] p-3">
                <p className="text-sm font-semibold text-white">{course.title}</p>
                <p className="text-xs text-white/65">{course.provider} • {course.duration}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#6877ff]/40 bg-gradient-to-b from-[#172161] to-[#0e1238] p-5">
          <h3 className="text-lg font-semibold text-white">Pro Tips: Market Demand</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
            {marketProTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
