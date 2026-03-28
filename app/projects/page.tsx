import { PortfolioRouteShell } from "@/components/portfolio-route-shell";
import { ProjectsSection } from "@/components/projects-section";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects(8);

  return (
    <PortfolioRouteShell
      eyebrow="projects"
      title="Selected work"
      description="A focused look at the portfolio graph, the strongest examples, and the evidence behind each one."
    >
      <ProjectsSection projects={projects} />
    </PortfolioRouteShell>
  );
}
