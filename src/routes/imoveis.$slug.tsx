import { createFileRoute } from "@tanstack/react-router";
import { ListingDetail } from "@/components/site/ListingDetail";

export const Route = createFileRoute("/imoveis/$slug")({
  head: () => ({
    meta: [
      { title: "Imóvel — Grupo Só Vendas" },
      { name: "description", content: "Detalhes do imóvel disponível através do Grupo Só Vendas." },
      { property: "og:title", content: "Imóvel — Grupo Só Vendas" },
      {
        property: "og:description",
        content: "Veja fotografias, características e fale com o consultor sobre este imóvel.",
      },
    ],
  }),
  component: ImovelPage,
});

function ImovelPage() {
  const { slug } = Route.useParams();
  return <ListingDetail slug={slug} kind="imovel" />;
}
