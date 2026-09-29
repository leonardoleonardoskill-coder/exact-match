import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { ListingBrowser } from "@/components/site/ListingBrowser";

export const Route = createFileRoute("/viaturas/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Viaturas disponíveis em Angola — Grupo Só Vendas" },
      {
        name: "description",
        content: "Viaturas ligeiras, SUV, pick-ups e pesados disponíveis através do Grupo Só Vendas.",
      },
      { property: "og:title", content: "Viaturas disponíveis em Angola — Grupo Só Vendas" },
      {
        property: "og:description",
        content: "Pesquise viaturas por categoria, província e orçamento e fale com o consultor.",
      },
    ],
  }),
  component: ViaturasPage,
});

function ViaturasPage() {
  const { q } = Route.useSearch();

  return (
    <PublicLayout whatsappMessage="Olá, estou a ver as viaturas no site do Grupo Só Vendas.">
      <div className="container-page py-10">
        <p className="text-eyebrow">Catálogo</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Viaturas disponíveis</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Viaturas intermediadas pelo Grupo Só Vendas. Filtre por categoria, província e orçamento.
        </p>

        <div className="mt-8">
          <ListingBrowser kind="viatura" initialSearch={q} />
        </div>
      </div>
    </PublicLayout>
  );
}
