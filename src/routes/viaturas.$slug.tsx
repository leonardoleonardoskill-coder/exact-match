import { createFileRoute } from "@tanstack/react-router";
import { ListingDetail } from "@/components/site/ListingDetail";

export const Route = createFileRoute("/viaturas/$slug")({
  head: () => ({
    meta: [
      { title: "Viatura — Grupo Só Vendas" },
      { name: "description", content: "Detalhes da viatura disponível através do Grupo Só Vendas." },
      { property: "og:title", content: "Viatura — Grupo Só Vendas" },
      {
        property: "og:description",
        content: "Veja fotografias, características e fale com o consultor sobre esta viatura.",
      },
    ],
  }),
  component: ViaturaPage,
});

function ViaturaPage() {
  const { slug } = Route.useParams();
  return <ListingDetail slug={slug} kind="viatura" />;
}
