import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicListingsQuery, type ListingFilters, type ListingKind } from "@/lib/queries";
import { ListingCard } from "./ListingCard";
import { ListingFiltersBar } from "./ListingFilters";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingBrowser({
  kind,
  initialSearch,
}: {
  kind: ListingKind;
  initialSearch?: string;
}) {
  const [filters, setFilters] = useState<ListingFilters>({
    kind,
    ...(initialSearch ? { search: initialSearch } : {}),
  });
  const { data, isLoading, isError } = useQuery(publicListingsQuery(filters));

  return (
    <div className="space-y-6">
      <ListingFiltersBar value={filters} onChange={setFilters} />

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Não foi possível carregar os anúncios. Atualize a página.
        </p>
      )}

      {!isLoading && !isError && (data?.length ?? 0) === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-display text-lg font-bold">Sem resultados para esta procura</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Ajuste os filtros ou diga-nos o que procura na página de contacto — o consultor procura por si.
          </p>
        </div>
      )}

      {!!data?.length && (
        <>
          <p className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? "anúncio" : "anúncios"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
