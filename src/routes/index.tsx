import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ShieldCheck, Handshake, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { ListingCard } from "@/components/site/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featuredListingsQuery, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grupo Só Vendas — Imóveis e viaturas em Angola" },
      {
        name: "description",
        content:
          "Consulte imóveis, terrenos, espaços comerciais e viaturas disponíveis em Angola e fale directamente com o consultor Leonardo Jimi.",
      },
      { property: "og:title", content: "Grupo Só Vendas — Imóveis e viaturas em Angola" },
      {
        property: "og:description",
        content:
          "Oportunidades de compra e arrendamento em Angola, com acompanhamento de um consultor de intermediação.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<"imovel" | "viatura">("imovel");
  const [term, setTerm] = useState("");
  const { data: properties } = useQuery(featuredListingsQuery("imovel", 3));
  const { data: vehicles } = useQuery(featuredListingsQuery("viatura", 3));
  const { data: settings } = useQuery(settingsQuery);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    navigate({
      to: kind === "imovel" ? "/imoveis" : "/viaturas",
      search: term ? { q: term } : {},
    });
  }

  return (
    <PublicLayout>
      {/* Bloco de procura — a acção principal do site */}
      <section className="border-b border-border bg-surface">
        <div className="container-page py-14 md:py-20">
          <p className="text-eyebrow">Intermediação em Angola</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Encontre o imóvel ou a viatura e fale hoje com o consultor.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            O Grupo Só Vendas reúne oportunidades verificadas e trata do contacto entre quem procura e
            quem vende ou arrenda.
          </p>

          <form
            onSubmit={submitSearch}
            className="mt-8 max-w-3xl rounded-xl border border-border bg-card p-4 shadow-card"
          >
            <div className="mb-3 inline-flex rounded-md bg-secondary p-1">
              {(
                [
                  { key: "imovel", label: "Imóveis" },
                  { key: "viatura", label: "Viaturas" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setKind(opt.key)}
                  className={
                    kind === opt.key
                      ? "rounded px-4 py-1.5 text-sm font-semibold bg-card text-foreground shadow-card"
                      : "rounded px-4 py-1.5 text-sm font-medium text-muted-foreground"
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={
                  kind === "imovel" ? "Zona, tipologia ou referência" : "Marca, modelo ou referência"
                }
                className="flex-1"
              />
              <Button type="submit" className="sm:w-44">
                <Search className="mr-2 h-4 w-4" /> Procurar
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Imóveis recentes */}
      <Section
        title="Imóveis disponíveis"
        action={{ to: "/imoveis", label: "Ver todos os imóveis" }}
        empty="Ainda não há imóveis publicados. Diga-nos o que procura e o consultor avisa assim que surgir."
        items={properties ?? []}
      />

      {/* Viaturas recentes */}
      <Section
        title="Viaturas disponíveis"
        action={{ to: "/viaturas", label: "Ver todas as viaturas" }}
        empty="Ainda não há viaturas publicadas. Envie o seu pedido e o consultor procura por si."
        items={vehicles ?? []}
      />

      {/* Como funciona a intermediação — razão comercial: reduzir dúvidas antes do contacto */}
      <section className="container-page py-14">
        <p className="text-eyebrow">Como trabalhamos</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Step
            icon={<Search className="h-5 w-5" />}
            title="1. Escolhe ou descreve"
            text="Consulta os anúncios publicados ou descreve o que procura, com zona e orçamento."
          />
          <Step
            icon={<Handshake className="h-5 w-5" />}
            title="2. O consultor trata"
            text={`${settings?.["consultant_name"] || "Leonardo Jimi"} confirma disponibilidade, condições e marca a visita.`}
          />
          <Step
            icon={<ShieldCheck className="h-5 w-5" />}
            title="3. Fecha com acompanhamento"
            text="Apoio na negociação e na documentação até à conclusão do negócio."
          />
        </div>
      </section>
    </PublicLayout>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function Section({
  title,
  action,
  items,
  empty,
}: {
  title: string;
  action: { to: "/imoveis" | "/viaturas"; label: string };
  items: React.ComponentProps<typeof ListingCard>["listing"][];
  empty: string;
}) {
  return (
    <section className="container-page py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-extrabold">{title}</h2>
        <Link to={action.to} className="text-sm font-semibold text-accent hover:underline">
          {action.label} →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">{empty}</p>
          <Link
            to="/contacto"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            <MapPin className="h-4 w-4" /> Dizer o que procuro
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}
