import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { ListingBrowser } from "@/components/site/ListingBrowser";

export const Route = createFileRoute("/imoveis/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Imóveis disponíveis em Angola — Grupo Só Vendas" },
      {
        name: "description",
        content:
          "Apartamentos, vivendas, terrenos e espaços comerciais para compra ou arrendamento em Angola.",
      },
      { property: "og:title", content: "Imóveis disponíveis em Angola — Grupo Só Vendas" },
      {
        property: "og:description",
        content: "Pesquise imóveis por província, tipologia e orçamento e fale com o consultor.",
      },
    ],
  }),
  component: ImoveisPage,
});

function ImoveisPage() {
  const { q } = Route.useSearch();

  return (
    <PublicLayout whatsappMessage="Olá, estou a ver os imóveis no site do Grupo Só Vendas.">
      <div className="container-page py-10">
        <p className="text-eyebrow">Catálogo</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Imóveis disponíveis</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Apartamentos, vivendas, terrenos e espaços comerciais. Filtre por zona, tipologia e orçamento.
        </p>

        <div className="mt-8">
          <ListingBrowser kind="imovel" initialSearch={q} />
        </div>
      </div>
    </PublicLayout>
  );
}
