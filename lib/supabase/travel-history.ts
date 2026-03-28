import { createClient } from "@supabase/supabase-js";

export type TravelLocation = {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  sortOrder: number;
};

type TravelLocationRow = {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  sort_order: number | null;
};

const FALLBACK_TRAVEL_LOCATIONS: TravelLocation[] = [
  {
    slug: "bangkok",
    name: "Bangkok",
    latitude: 13.7563,
    longitude: 100.5018,
    imageUrl: "https://source.unsplash.com/featured/1600x1000/?bangkok,thailand,city,night",
    sortOrder: 1,
  },
  {
    slug: "taipei",
    name: "Taipei",
    latitude: 25.033,
    longitude: 121.5654,
    imageUrl: "https://source.unsplash.com/featured/1600x1000/?taipei,taiwan,city,night",
    sortOrder: 2,
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    latitude: 24.4539,
    longitude: 54.3773,
    imageUrl: "https://source.unsplash.com/featured/1600x1000/?abu-dhabi,uae,city,skyline",
    sortOrder: 3,
  },
  {
    slug: "chicago",
    name: "Chicago",
    latitude: 41.8781,
    longitude: -87.6298,
    imageUrl: "https://source.unsplash.com/featured/1600x1000/?chicago,illinois,skyline,night",
    sortOrder: 4,
  },
];

function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getTravelLocations(limit = 8): Promise<TravelLocation[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return FALLBACK_TRAVEL_LOCATIONS.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("travel_locations")
    .select("slug, name, latitude, longitude, image_url, sort_order")
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return FALLBACK_TRAVEL_LOCATIONS.slice(0, limit);
  }

  return (data as TravelLocationRow[]).map((row, index) => ({
    slug: row.slug || toSlug(row.name),
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    imageUrl: row.image_url,
    sortOrder: row.sort_order ?? index + 1,
  }));
}
