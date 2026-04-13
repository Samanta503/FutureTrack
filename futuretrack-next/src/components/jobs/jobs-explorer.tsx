"use client";

import { useEffect, useMemo, useState } from "react";
import { courses, jobs, sampleUserProfile } from "@/data/mock-data";
import { Course, Job, UserProfile } from "@/lib/types";
import { calculateMatchPercentage, filterJobs, getCourseRecommendations } from "@/lib/career-utils";
import { getApiUrl } from "@/lib/api";

export function JobsExplorer() {
  const [jobsData, setJobsData] = useState<Job[]>(jobs);
  const [coursesData, setCoursesData] = useState<Course[]>(courses);
  const [profile, setProfile] = useState<UserProfile>(sampleUserProfile);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(jobsData[0]?.id ?? null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsRes, coursesRes, userRes] = await Promise.all([
          fetch(getApiUrl("/jobs"), { cache: "no-store" }),
          fetch(getApiUrl("/courses"), { cache: "no-store" }),
          fetch(getApiUrl("/users/1"), { cache: "no-store" }),
        ]);

        if (jobsRes.ok) {
          const payload = await jobsRes.json();
          if (payload?.data?.length) {
            setJobsData(payload.data);
            setSelectedJobId(payload.data[0].id);
          }
        }

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

  const filteredJobs = useMemo(
    () => filterJobs(jobsData, query, domain, level, location),
    [jobsData, query, domain, level, location],
  );

  const selectedJob = filteredJobs.find((job) => job.id === selectedJobId) ?? filteredJobs[0] ?? null;

  const analysis = selectedJob
    ? calculateMatchPercentage(profile.skills, selectedJob.requiredSkills)
    : null;

  const recommendedCourses = analysis
    ? getCourseRecommendations(analysis.missingSkills, coursesData)
    : [];

  const domains = [...new Set(jobsData.map((job) => job.domain))];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, company, skill"
            className="rounded-xl border border-white/15 bg-[#0f1235] px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none"
          />

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

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#0f1235] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">Experience level</option>
            <option value="Entry">Entry</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="rounded-xl border border-white/15 bg-[#0f1235] px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none"
          />
        </div>

        <div className="mt-5 grid gap-4">
          {filteredJobs.map((job) => {
            const match = calculateMatchPercentage(profile.skills, job.requiredSkills);

            return (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedJob?.id === job.id
                    ? "border-[#6f7dff] bg-[#121847]"
                    : "border-white/10 bg-[#0d1133] hover:border-white/30"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                  <span className="rounded-full bg-[#3f4fff]/35 px-3 py-1 text-xs font-semibold text-[#c8d0ff]">
                    {match.percent}% match
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/70">{job.company} • {job.location}</p>
                <p className="mt-3 text-sm text-white/75">{job.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/75">
                      {skill}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}

          {!filteredJobs.length ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d1133] p-6 text-center text-sm text-white/70">
              No jobs found with current filters.
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        {selectedJob && analysis ? (
          <>
            <h3 className="text-xl font-semibold text-white">{selectedJob.title}</h3>
            <p className="mt-1 text-sm text-white/70">
              {selectedJob.company} • {selectedJob.location} • {selectedJob.salaryRange}
            </p>

            <div className="mt-4 rounded-2xl border border-[#6f7dff]/30 bg-[#11174a] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/80">Profile Match</p>
                <p className="text-lg font-semibold text-[#9fbeff]">{analysis.percent}%</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6171ff] to-[#61ddff]"
                  style={{ width: `${analysis.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Missing Skills</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.missingSkills.length ? (
                  analysis.missingSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-[#2a1a46] px-3 py-1 text-xs text-[#ffb1d2]">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-emerald-300">Great fit. No critical skill gaps found.</span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Course Suggestions</h4>
              <div className="mt-2 space-y-2">
                {recommendedCourses.length ? (
                  recommendedCourses.map((course) => (
                    <div key={course.id} className="rounded-xl border border-white/10 bg-[#0d1133] p-3">
                      <p className="text-sm font-semibold text-white">{course.title}</p>
                      <p className="text-xs text-white/65">
                        {course.provider} • {course.duration} • {course.level}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/70">No targeted courses needed right now.</p>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1133] p-4">
              <h4 className="text-sm font-semibold text-white">Improvement Tips</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/75">
                <li>Add one project case study in your portfolio.</li>
                <li>Highlight measurable impact in resume bullets.</li>
                <li>Practice domain interview questions weekly.</li>
              </ul>
            </div>
          </>
        ) : (
          <p className="text-sm text-white/70">Select a job to view full details.</p>
        )}
      </section>
    </div>
  );
}
