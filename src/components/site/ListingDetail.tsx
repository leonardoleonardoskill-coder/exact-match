import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapPin, ImageOff } from "lucide-react";
import { PublicLayout } from "./PublicLayout";
import { StatusBadge } from "./StatusBadge";
import { LeadForm } from "./LeadForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listingBySlugQuery, settingsQuery, sortedPhotos, type ListingKind } from "@/lib/queries";
import { formatKwanza, formatNumber, locationLabel, PURPOSE_LABEL, whatsappLink } from "@/lib/format";

export function ListingDetail({ slug, kind }: { slug: string; kind: ListingKind }) {
  const { data: listing, isLoading } = useQuery(listingBySlugQuery(slug));
  const { data: settings } = useQuery(settingsQuery);
  const [active, setActive] = useState(0);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container-page py-10">
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </PublicLayout>
    );
  }

  if (!listing || listing.kind !== kind) {
    return (
      <PublicLayout>
        <div className="container-page py-20 text-center">
          <h1 className="font-display text-2xl font-extrabold">Anúncio indisponível</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este anúncio já não está publicado ou o endereço está incorrecto.
          </p>
          <Button asChild className="mt-6">
            <Link to={kind === "imovel" ? "/imoveis" : "/viaturas"}>
              Ver anúncios disponíveis
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const photos = sortedPhotos(listing);
  const property = listing.property_details;
  const vehicle = listing.vehicle_details;
  const waMessage = `Olá, tenho interesse no anúncio ${listing.reference} (${listing.title}).`;
  const wa = whatsappLink(settings?.["whatsapp_number"], waMessage);

  const specs: { label: string; value: string }[] = [];
  if (property) {
    if (property.bedrooms != null) specs.push({ label: "Quartos", value: String(property.bedrooms) });
    if (property.bathrooms != null) specs.push({ label: "Casas de banho", value: String(property.bathrooms) });
    if (property.area_sqm != null) specs.push({ label: "Área", value: formatNumber(Number(property.area_sqm), " m²") });
    if (property.floor) specs.push({ label: "Piso", value: property.floor });
    if (property.condition) specs.push({ label: "Estado", value: property.condition });
    specs.push({ label: "Condomínio", value: property.condominium ? "Sim" : "Não" });
    specs.push({ label: "Garagem", value: property.has_garage ? "Sim" : "Não" });
  }
  if (vehicle) {
    if (vehicle.brand) specs.push({ label: "Marca", value: vehicle.brand });
    if (vehicle.model) specs.push({ label: "Modelo", value: vehicle.model });
    if (vehicle.year != null) specs.push({ label: "Ano", value: String(vehicle.year) });
    if (vehicle.mileage_km != null) specs.push({ label: "Quilometragem", value: formatNumber(vehicle.mileage_km, " km") });
    if (vehicle.fuel) specs.push({ label: "Combustível", value: vehicle.fuel });
    if (vehicle.transmission) specs.push({ label: "Caixa", value: vehicle.transmission });
    if (vehicle.color) specs.push({ label: "Cor", value: vehicle.color });
    if (vehicle.seats != null) specs.push({ label: "Lugares", value: String(vehicle.seats) });
  }

  return (
    <PublicLayout whatsappMessage={waMessage}>
      <div className="container-page py-8">
        <Link
          to={kind === "imovel" ? "/imoveis" : "/viaturas"}
          className="text-sm font-semibold text-accent hover:underline"
        >
          ← {kind === "imovel" ? "Todos os imóveis" : "Todas as viaturas"}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              {photos.length > 0 ? (
                <img
                  src={photos[active]?.url}
                  alt={listing.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center text-muted-foreground">
                  <ImageOff className="h-10 w-10" />
                </div>
              )}
            </div>

            {photos.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActive(index)}
                    className={
                      index === active
                        ? "h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 border-accent"
                        : "h-20 w-28 shrink-0 overflow-hidden rounded-md border border-border"
                    }
                  >
                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={listing.status} />
                <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {listing.categories?.name ?? (kind === "imovel" ? "Imóvel" : "Viatura")}
                </span>
                {kind === "imovel" && (
                  <span className="text-xs text-muted-foreground">{PURPOSE_LABEL[listing.purpose]}</span>
                )}
                <span className="text-xs text-muted-foreground">Ref. {listing.reference}</span>
              </div>

              <h1 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">{listing.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {locationLabel(listing.locations)}
                {listing.address_note ? ` · ${listing.address_note}` : ""}
              </p>

              {listing.description && (
                <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {listing.description}
                </p>
              )}

              {specs.length > 0 && (
                <div className="mt-8">
                  <p className="text-eyebrow">Características</p>
                  <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between border-b border-border pb-2 text-sm">
                        <dt className="text-muted-foreground">{spec.label}</dt>
                        <dd className="font-semibold">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-eyebrow">Preço</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-primary">
                {formatKwanza(listing.price ? Number(listing.price) : null, listing.price_on_request)}
                {listing.purpose === "arrendamento" && !listing.price_on_request && (
                  <span className="text-base font-semibold text-muted-foreground"> /mês</span>
                )}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Consultor: {settings?.["consultant_name"] || "Leonardo Jimi"}
              </p>
              {wa && (
                <Button asChild className="mt-4 w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
                  <a href={wa} target="_blank" rel="noreferrer">
                    Falar no WhatsApp sobre {listing.reference}
                  </a>
                </Button>
              )}
            </div>

            <LeadForm
              listingId={listing.id}
              source="anuncio"
              defaultMessage={`Tenho interesse no anúncio ${listing.reference}.`}
              submitLabel="Pedir contacto do consultor"
            />
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
