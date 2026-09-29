import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ListingKind = Database["public"]["Enums"]["listing_kind"];
export type ListingStatus = Database["public"]["Enums"]["listing_status"];
export type ListingPurpose = Database["public"]["Enums"]["listing_purpose"];
export type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type PhotoRow = Database["public"]["Tables"]["listing_photos"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type LocationRow = Database["public"]["Tables"]["locations"]["Row"];
export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

const LISTING_SELECT = `
  id, kind, reference, slug, title, description, purpose, price, currency,
  price_on_request, status, published, featured, category_id, location_id,
  address_note, created_at,
  categories ( id, name, slug ),
  locations ( id, province, municipality ),
  listing_photos ( id, url, storage_path, sort_order, is_cover ),
  property_details ( bedrooms, bathrooms, area_sqm, floor, condominium, condition, has_garage ),
  vehicle_details ( brand, model, year, mileage_km, fuel, transmission, color, seats )
`;

export type ListingFull = ListingRow & {
  categories: Pick<CategoryRow, "id" | "name" | "slug"> | null;
  locations: Pick<LocationRow, "id" | "province" | "municipality"> | null;
  listing_photos: Pick<PhotoRow, "id" | "url" | "storage_path" | "sort_order" | "is_cover">[];
  property_details: Database["public"]["Tables"]["property_details"]["Row"] | null;
  vehicle_details: Database["public"]["Tables"]["vehicle_details"]["Row"] | null;
};

export type ListingFilters = {
  kind: ListingKind;
  search?: string;
  categoryId?: string;
  locationId?: string;
  purpose?: ListingPurpose;
  maxPrice?: number;
  bedrooms?: number;
};

export function publicListingsQuery(filters: ListingFilters) {
  return queryOptions({
    queryKey: ["listings", "public", filters],
    queryFn: async (): Promise<ListingFull[]> => {
      let query = supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("kind", filters.kind)
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters.search) query = query.ilike("title", `%${filters.search}%`);
      if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
      if (filters.locationId) query = query.eq("location_id", filters.locationId);
      if (filters.purpose) query = query.eq("purpose", filters.purpose);
      if (filters.maxPrice) query = query.lte("price", filters.maxPrice);

      const { data, error } = await query;
      if (error) throw error;
      let rows = (data ?? []) as unknown as ListingFull[];
      if (filters.bedrooms) {
        rows = rows.filter((r) => (r.property_details?.bedrooms ?? 0) >= filters.bedrooms!);
      }
      return rows;
    },
  });
}

export function featuredListingsQuery(kind: ListingKind, limit = 3) {
  return queryOptions({
    queryKey: ["listings", "featured", kind, limit],
    queryFn: async (): Promise<ListingFull[]> => {
      const { data, error } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("kind", kind)
        .eq("published", true)
        .eq("status", "disponivel")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as ListingFull[];
    },
  });
}

export function listingBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["listing", slug],
    queryFn: async (): Promise<ListingFull | null> => {
      const { data, error } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as ListingFull) ?? null;
    },
  });
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<CategoryRow[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("kind")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const locationsQuery = queryOptions({
  queryKey: ["locations"],
  queryFn: async (): Promise<LocationRow[]> => {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("province")
      .order("municipality", { nullsFirst: true });
    if (error) throw error;
    return data ?? [];
  },
});

export type SettingsMap = Record<string, string>;

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async (): Promise<SettingsMap> => {
    const { data, error } = await supabase.from("settings").select("key, value");
    if (error) throw error;
    const map: SettingsMap = {};
    for (const row of data ?? []) map[row.key] = row.value ?? "";
    return map;
  },
});

/* ---------- Admin ---------- */

export const adminListingsQuery = queryOptions({
  queryKey: ["admin", "listings"],
  queryFn: async (): Promise<ListingFull[]> => {
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as ListingFull[];
  },
});

export function adminListingQuery(id: string) {
  return queryOptions({
    queryKey: ["admin", "listing", id],
    queryFn: async (): Promise<ListingFull | null> => {
      const { data, error } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as ListingFull) ?? null;
    },
  });
}

export type LeadWithListing = LeadRow & {
  listings: Pick<ListingRow, "id" | "title" | "reference" | "kind" | "slug"> | null;
};

export const adminLeadsQuery = queryOptions({
  queryKey: ["admin", "leads"],
  queryFn: async (): Promise<LeadWithListing[]> => {
    const { data, error } = await supabase
      .from("leads")
      .select("*, listings ( id, title, reference, kind, slug )")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as LeadWithListing[];
  },
});

export function coverPhoto(listing: ListingFull): string | null {
  const photos = [...(listing.listing_photos ?? [])].sort(
    (a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
  );
  return photos[0]?.url ?? null;
}

export function sortedPhotos(listing: ListingFull) {
  return [...(listing.listing_photos ?? [])].sort(
    (a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
  );
}

export async function createLead(input: {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  listing_id?: string | null;
  source: Database["public"]["Enums"]["lead_source"];
}) {
  const { error } = await supabase.from("leads").insert({
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    message: input.message || null,
    listing_id: input.listing_id || null,
    source: input.source,
  });
  if (error) throw error;
}
