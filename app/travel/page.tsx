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
      description="Jackson's actual travel history plotted on a full-page interactive globe with destination pop-ups."
      contentClassName='max-w-none px-4 pb-0 sm:px-6 lg:px-8'
    >
      <TravelCoordinates locations={locations} />
    </PortfolioRouteShell>
  );
}
