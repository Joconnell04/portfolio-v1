export type TravelLocation = {
  slug: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  visitLabel: string;
  note?: string;
  imageUrl: string;
  sortOrder: number;
};

type TravelLocationSeed = Omit<TravelLocation, 'imageUrl'> & {
  imageQuery: string;
};

const makeLocation = (seed: TravelLocationSeed): TravelLocation => ({
  slug: seed.slug,
  name: seed.name,
  region: seed.region,
  latitude: seed.latitude,
  longitude: seed.longitude,
  visitLabel: seed.visitLabel,
  note: seed.note,
  imageUrl: 'https://source.unsplash.com/featured/1600x1000/?' + encodeURIComponent(seed.imageQuery),
  sortOrder: seed.sortOrder,
});

const ACTUAL_TRAVEL_LOCATIONS: TravelLocation[] = [
  makeLocation({ slug: 'france', name: 'France', region: 'Europe', latitude: 48.8566, longitude: 2.3522, visitLabel: 'many / unknown', note: 'user indicated infinite/repeat travel', imageQuery: 'france,paris,travel', sortOrder: 1 }),
  makeLocation({ slug: 'germany', name: 'Germany', region: 'Europe', latitude: 52.52, longitude: 13.405, visitLabel: '3 visits', imageQuery: 'germany,berlin,travel', sortOrder: 2 }),
  makeLocation({ slug: 'belgium', name: 'Belgium', region: 'Europe', latitude: 50.8503, longitude: 4.3517, visitLabel: '1 visit', imageQuery: 'belgium,brussels,travel', sortOrder: 3 }),
  makeLocation({ slug: 'luxembourg', name: 'Luxembourg', region: 'Europe', latitude: 49.6116, longitude: 6.1319, visitLabel: '4 visits', imageQuery: 'luxembourg,city,travel', sortOrder: 4 }),
  makeLocation({ slug: 'netherlands', name: 'Netherlands', region: 'Europe', latitude: 52.3676, longitude: 4.9041, visitLabel: '2 visits', imageQuery: 'netherlands,amsterdam,travel', sortOrder: 5 }),
  makeLocation({ slug: 'england', name: 'England', region: 'Europe', latitude: 51.5072, longitude: -0.1276, visitLabel: '1 visit', imageQuery: 'england,london,travel', sortOrder: 6 }),
  makeLocation({ slug: 'italy', name: 'Italy', region: 'Europe', latitude: 41.9028, longitude: 12.4964, visitLabel: '1 visit', imageQuery: 'italy,rome,travel', sortOrder: 7 }),
  makeLocation({ slug: 'austria', name: 'Austria', region: 'Europe', latitude: 48.2082, longitude: 16.3738, visitLabel: '1 visit', note: 'user had an asterisk on this entry', imageQuery: 'austria,vienna,travel', sortOrder: 8 }),
  makeLocation({ slug: 'switzerland', name: 'Switzerland', region: 'Europe', latitude: 46.948, longitude: 7.4474, visitLabel: '3 visits', imageQuery: 'switzerland,alps,travel', sortOrder: 9 }),
  makeLocation({ slug: 'portugal', name: 'Portugal', region: 'Europe', latitude: 38.7223, longitude: -9.1393, visitLabel: '3 visits', imageQuery: 'portugal,lisbon,travel', sortOrder: 10 }),
  makeLocation({ slug: 'czech-republic', name: 'Czech Republic', region: 'Europe', latitude: 50.0755, longitude: 14.4378, visitLabel: '1 visit', imageQuery: 'czech-republic,prague,travel', sortOrder: 11 }),
  makeLocation({ slug: 'hungary', name: 'Hungary', region: 'Europe', latitude: 47.4979, longitude: 19.0402, visitLabel: '1 visit', imageQuery: 'hungary,budapest,travel', sortOrder: 12 }),
  makeLocation({ slug: 'greece', name: 'Greece', region: 'Europe', latitude: 37.9838, longitude: 23.7275, visitLabel: '1 visit', imageQuery: 'greece,athens,travel', sortOrder: 13 }),
  makeLocation({ slug: 'spain', name: 'Spain', region: 'Europe', latitude: 40.4168, longitude: -3.7038, visitLabel: '2 visits', imageQuery: 'spain,madrid,travel', sortOrder: 14 }),
  makeLocation({ slug: 'denmark', name: 'Denmark', region: 'Europe', latitude: 55.6761, longitude: 12.5683, visitLabel: '1 visit', imageQuery: 'denmark,copenhagen,travel', sortOrder: 15 }),
  makeLocation({ slug: 'japan', name: 'Japan', region: 'Asia', latitude: 35.6762, longitude: 139.6503, visitLabel: '2 visits', imageQuery: 'japan,tokyo,travel', sortOrder: 16 }),
  makeLocation({ slug: 'south-korea', name: 'South Korea', region: 'Asia', latitude: 37.5665, longitude: 126.978, visitLabel: '2 visits', imageQuery: 'south-korea,seoul,travel', sortOrder: 17 }),
  makeLocation({ slug: 'taiwan', name: 'Taiwan', region: 'Asia', latitude: 25.033, longitude: 121.5654, visitLabel: '1 visit', note: 'user had an asterisk on this entry', imageQuery: 'taiwan,taipei,travel', sortOrder: 18 }),
  makeLocation({ slug: 'canada', name: 'Canada', region: 'North America', latitude: 45.4215, longitude: -75.6972, visitLabel: '2 visits', imageQuery: 'canada,ottawa,travel', sortOrder: 19 }),
  makeLocation({ slug: 'puerto-rico', name: 'Puerto Rico', region: 'Caribbean', latitude: 18.4655, longitude: -66.1057, visitLabel: 'unknown', note: 'user entered a question mark for count', imageQuery: 'puerto-rico,san-juan,travel', sortOrder: 20 }),
  makeLocation({ slug: 'mexico', name: 'Mexico', region: 'North America', latitude: 19.4326, longitude: -99.1332, visitLabel: '4 visits', imageQuery: 'mexico,mexico-city,travel', sortOrder: 21 }),
  makeLocation({ slug: 'peru', name: 'Peru', region: 'South America', latitude: -12.0464, longitude: -77.0428, visitLabel: '2 visits', imageQuery: 'peru,lima,travel', sortOrder: 22 }),
  makeLocation({ slug: 'colombia', name: 'Colombia', region: 'South America', latitude: 4.711, longitude: -74.0721, visitLabel: '2 visits', imageQuery: 'colombia,bogota,travel', sortOrder: 23 }),
  makeLocation({ slug: 'chile', name: 'Chile', region: 'South America', latitude: -33.4489, longitude: -70.6693, visitLabel: '2 visits', imageQuery: 'chile,santiago,travel', sortOrder: 24 }),
  makeLocation({ slug: 'brazil', name: 'Brazil', region: 'South America', latitude: -15.7939, longitude: -47.8828, visitLabel: '1 visit', imageQuery: 'brazil,brasilia,travel', sortOrder: 25 }),
  makeLocation({ slug: 'argentina', name: 'Argentina', region: 'South America', latitude: -34.6037, longitude: -58.3816, visitLabel: '1 visit', imageQuery: 'argentina,buenos-aires,travel', sortOrder: 26 }),
];

export async function getTravelLocations(limit = 32): Promise<TravelLocation[]> {
  return ACTUAL_TRAVEL_LOCATIONS.slice(0, limit);
}
