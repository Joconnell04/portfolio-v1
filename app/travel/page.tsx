import { PortfolioRouteShell } from "@/components/portfolio-route-shell";
import { TravelMissionControl } from "@/components/travel-mission-control";
import { getTravelLocations } from "@/lib/supabase/travel-history";

export const dynamic = "force-dynamic";

export default async function TravelPage() {
  const locations = await getTravelLocations();

  return (
    <PortfolioRouteShell
      eyebrow="travel"
      title="Mission Control"
      description="Jackson's travel history plotted as a brutalist globe with destination windows."
    >
      <TravelMissionControl locations={locations} />
    </PortfolioRouteShell>
  );
}
