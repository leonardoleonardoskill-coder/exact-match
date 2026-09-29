import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Ruler, Gauge, Calendar, MapPin, ImageOff } from "lucide-react";
import { coverPhoto, type ListingFull } from "@/lib/queries";
import { formatKwanza, formatNumber, locationLabel, PURPOSE_LABEL } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function ListingCard({ listing }: { listing: ListingFull }) {
  const cover = coverPhoto(listing);
  const isProperty = listing.kind === "imovel";
  const to = isProperty ? "/imoveis/$slug" : "/viaturas/$slug";
  const details = isProperty ? listing.property_details : null;
  const vehicle = !isProperty ? listing.vehicle_details : null;

  return (
    <Link
      to={to}
      params={{ slug: listing.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <StatusBadge status={listing.status} />
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-foreground">
          {listing.reference}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">
            {listing.categories?.name ?? (isProperty ? "Imóvel" : "Viatura")}
          </span>
          {isProperty && <span>{PURPOSE_LABEL[listing.purpose]}</span>}
        </div>

        <h3 className="font-display text-base font-bold leading-snug">{listing.title}</h3>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {locationLabel(listing.locations)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {details?.bedrooms != null && (
            <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{details.bedrooms}</span>
          )}
          {details?.bathrooms != null && (
            <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{details.bathrooms}</span>
          )}
          {details?.area_sqm != null && (
            <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" />{formatNumber(Number(details.area_sqm), " m²")}</span>
          )}
          {vehicle?.year != null && (
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{vehicle.year}</span>
          )}
          {vehicle?.mileage_km != null && (
            <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{formatNumber(vehicle.mileage_km, " km")}</span>
          )}
        </div>

        <p className="font-display text-lg font-extrabold text-primary">
          {formatKwanza(listing.price ? Number(listing.price) : null, listing.price_on_request)}
          {listing.purpose === "arrendamento" && !listing.price_on_request && (
            <span className="text-sm font-semibold text-muted-foreground"> /mês</span>
          )}
        </p>
      </div>
    </Link>
  );
}
