import { RecruiterConsole } from "@/components/recruiter-console";
import { getPortfolioProjects } from "@/lib/supabase/portfolio-projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getPortfolioProjects();

  return <RecruiterConsole projects={projects} />;
}
