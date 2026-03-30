import { RecruiterConsole } from "@/components/recruiter-console";
import { getGitHubContributionHeatmap } from "@/lib/github/contributions";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recruiter Terminal — Jackson O'Connell",
  description:
    "An AI-powered recruiter terminal to explore Jackson's background, projects, and experience.",
};

export default async function RecruiterPage() {
  const [projects, heatmap] = await Promise.all([
    getPortfolioProjects(),
    getGitHubContributionHeatmap("Joconnell04"),
  ]);

  return (
    <div className="min-h-screen bg-black pt-14 text-[#f0eaff]">
      <RecruiterConsole projects={projects} heatmap={heatmap} />
    </div>
  );
}
