import { PortfolioRouteShell } from '@/components/portfolio-route-shell';
import { TravelCoordinates } from '@/components/travel-mission-control';
import { getTravelLocations } from '@/lib/supabase/travel-history';

export const dynamic = 'force-dynamic';

export default async function TravelPage() {
  const locations = await getTravelLocations();

  return (
    <PortfolioRouteShell
      eyebrow='travel'
      title='Coordinates'
      description='Jackson\'s actual travel history plotted on an interactive globe with destination pop-ups.'
    >
      <TravelCoordinates locations={locations} />
    </PortfolioRouteShell>
  );
}
