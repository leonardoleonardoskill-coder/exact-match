import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site/PublicLayout";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Grupo Só Vendas — Intermediação em Angola" },
      {
        name: "description",
        content:
          "Como funciona a intermediação do Grupo Só Vendas: imóveis, terrenos, espaços comerciais e viaturas em Angola.",
      },
      { property: "og:title", content: "Sobre o Grupo Só Vendas" },
      {
        property: "og:description",
        content: "Intermediação de bens em Angola, do primeiro contacto à conclusão do negócio.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <PublicLayout>
      <div className="container-page max-w-3xl py-12">
        <p className="text-eyebrow">Sobre</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Grupo Só Vendas</h1>

        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
          {settings?.["about_text"] ||
            "O Grupo Só Vendas é uma actividade de intermediação em Angola. Ligamos quem procura a quem vende ou arrenda: imóveis, apartamentos, vivendas, terrenos, espaços comerciais e viaturas. Os anúncios publicados neste site são acompanhados por um consultor, que confirma as condições de cada bem antes da visita."}
        </p>

        <div className="mt-10 space-y-6">
          {[
            {
              title: "O que intermediamos",
              text: "Apartamentos, vivendas, terrenos, espaços comerciais e viaturas, para compra ou arrendamento.",
            },
            {
              title: "Como decorre o processo",
              text: "Escolhe um anúncio ou descreve o que procura; o consultor confirma disponibilidade e condições, organiza a visita e acompanha a negociação.",
            },
            {
              title: "Anúncios sempre actualizados",
              text: "Cada anúncio indica se está disponível, reservado, vendido ou arrendado, para evitar contactos sobre bens já fechados.",
            },
          ].map((block) => (
            <div key={block.title} className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold">{block.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{block.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Quer avançar?{" "}
          <Link to="/contacto" className="font-semibold text-accent hover:underline">
            Diga-nos o que procura
          </Link>
          .
        </p>
      </div>
    </PublicLayout>
  );
}
