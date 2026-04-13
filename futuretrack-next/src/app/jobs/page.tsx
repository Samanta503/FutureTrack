import { JobsExplorer } from "@/components/jobs/jobs-explorer";
import { SectionTitle } from "@/components/common/section-title";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Jobs"
        title="Find roles that match your profile"
        subtitle="Search by title or company, filter by domain and experience, and review skill gaps before applying."
      />

      <JobsExplorer />
    </div>
  );
}