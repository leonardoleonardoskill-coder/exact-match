import { useQuery } from "@tanstack/react-query";
import { categoriesQuery, locationsQuery, type ListingFilters as Filters } from "@/lib/queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
};

export function ListingFiltersBar({ value, onChange }: Props) {
  const { data: categories } = useQuery(categoriesQuery);
  const { data: locations } = useQuery(locationsQuery);
  const kindCategories = (categories ?? []).filter((c) => c.kind === value.kind);
  const isProperty = value.kind === "imovel";

  const selectClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="f-search">Pesquisar</Label>
          <Input
            id="f-search"
            value={value.search ?? ""}
            placeholder={isProperty ? "Ex.: apartamento T3 Talatona" : "Ex.: Toyota Hilux"}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="f-cat">Categoria</Label>
          <select
            id="f-cat"
            className={selectClass}
            value={value.categoryId ?? ""}
            onChange={(e) => onChange({ ...value, categoryId: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {kindCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="f-loc">Localização</Label>
          <select
            id="f-loc"
            className={selectClass}
            value={value.locationId ?? ""}
            onChange={(e) => onChange({ ...value, locationId: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {(locations ?? []).map((l) => (
              <option key={l.id} value={l.id}>
                {l.municipality ? `${l.municipality}, ${l.province}` : l.province}
              </option>
            ))}
          </select>
        </div>

        {isProperty && (
          <div className="space-y-1.5">
            <Label htmlFor="f-purpose">Finalidade</Label>
            <select
              id="f-purpose"
              className={selectClass}
              value={value.purpose ?? ""}
              onChange={(e) =>
                onChange({ ...value, purpose: (e.target.value || undefined) as Filters["purpose"] })
              }
            >
              <option value="">Venda e arrendamento</option>
              <option value="venda">Venda</option>
              <option value="arrendamento">Arrendamento</option>
            </select>
          </div>
        )}

        {isProperty && (
          <div className="space-y-1.5">
            <Label htmlFor="f-bed">Quartos (mín.)</Label>
            <Input
              id="f-bed"
              type="number"
              min={0}
              value={value.bedrooms ?? ""}
              onChange={(e) =>
                onChange({ ...value, bedrooms: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="f-price">Preço máximo (Kz)</Label>
          <Input
            id="f-price"
            type="number"
            min={0}
            value={value.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ ...value, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onChange({ kind: value.kind })}
          >
            Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
