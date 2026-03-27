import { RecruiterConsole } from "@/components/recruiter-console";
import { getGitHubContributionHeatmap } from "@/lib/github/contributions";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, heatmap] = await Promise.all([
    getPortfolioProjects(),
    getGitHubContributionHeatmap("Joconnell04"),
  ]);

  return <RecruiterConsole projects={projects} heatmap={heatmap} />;
}
