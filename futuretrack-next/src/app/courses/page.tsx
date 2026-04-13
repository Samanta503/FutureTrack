import { SectionTitle } from "@/components/common/section-title";
import { CoursesExplorer } from "@/components/courses/courses-explorer";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Courses"
        title="Upskill with targeted learning"
        subtitle="Discover domain-focused programs by level and category, with smart recommendations aligned to your interests."
      />

      <CoursesExplorer />
    </div>
  );
}