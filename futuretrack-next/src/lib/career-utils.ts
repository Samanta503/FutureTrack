import { Course, Job } from "@/lib/types";

export function calculateMatchPercentage(userSkills: string[], requiredSkills: string[]) {
  const normalized = new Set(userSkills.map((skill) => skill.toLowerCase()));
  const matched = requiredSkills.filter((skill) =>
    normalized.has(skill.toLowerCase()),
  );

  const percent = Math.round((matched.length / requiredSkills.length) * 100);

  return {
    percent,
    matchedSkills: matched,
    missingSkills: requiredSkills.filter(
      (skill) => !normalized.has(skill.toLowerCase()),
    ),
  };
}

export function getCourseRecommendations(
  missingSkills: string[],
  catalog: Course[],
) {
  if (!missingSkills.length) return [];

  return catalog.filter((course) =>
    course.skillsCovered.some((skill) =>
      missingSkills.some((missing) =>
        skill.toLowerCase().includes(missing.toLowerCase()),
      ),
    ),
  );
}

export function filterJobs(
  list: Job[],
  query: string,
  domain: string,
  level: string,
  location: string,
) {
  return list.filter((job) => {
    const joined = `${job.title} ${job.company} ${job.requiredSkills.join(" ")}`.toLowerCase();

    return (
      (!query || joined.includes(query.toLowerCase())) &&
      (!domain || job.domain === domain) &&
      (!level || job.experienceLevel === level) &&
      (!location || job.location.toLowerCase().includes(location.toLowerCase()))
    );
  });
}
