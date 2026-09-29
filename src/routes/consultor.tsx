import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site/PublicLayout";
import { LeadForm } from "@/components/site/LeadForm";
import { Button } from "@/components/ui/button";
import { settingsQuery } from "@/lib/queries";
import { whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/consultor")({
  head: () => ({
    meta: [
      { title: "Leonardo Jimi, consultor — Grupo Só Vendas" },
      {
        name: "description",
        content:
          "Fale directamente com Leonardo Jimi, consultor do Grupo Só Vendas para imóveis e viaturas em Angola.",
      },
      { property: "og:title", content: "Leonardo Jimi, consultor — Grupo Só Vendas" },
      {
        property: "og:description",
        content: "Acompanhamento na procura, visita, negociação e documentação.",
      },
    ],
  }),
  component: ConsultorPage,
});

function ConsultorPage() {
  const { data: settings } = useQuery(settingsQuery);
  const name = settings?.["consultant_name"] || "Leonardo Jimi";
  const bio = settings?.["consultant_bio"];
  const wa = whatsappLink(settings?.["whatsapp_number"], `Olá ${name}, vim pelo site do Grupo Só Vendas.`);

  return (
    <PublicLayout>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-eyebrow">{settings?.["consultant_role"] || "Consultor de intermediação"}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">{name}</h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            {bio ||
              "Consultor responsável pelo acompanhamento dos clientes do Grupo Só Vendas: confirma a disponibilidade dos bens, organiza visitas, apoia a negociação e acompanha a documentação até à conclusão do negócio."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Procura dirigida", text: "Pesquisa de imóveis e viaturas conforme zona e orçamento." },
              { title: "Visitas organizadas", text: "Marcação e acompanhamento das visitas no terreno." },
              { title: "Fecho acompanhado", text: "Apoio na negociação e na documentação do negócio." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <p className="font-display text-sm font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {settings?.["contact_phone"] && <span>Telefone: {settings["contact_phone"]}</span>}
            {settings?.["contact_email"] && <span>Email: {settings["contact_email"]}</span>}
          </div>

          {wa && (
            <Button asChild className="mt-6 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
              <a href={wa} target="_blank" rel="noreferrer">Falar com {name} no WhatsApp</a>
            </Button>
          )}
        </div>

        <div>
          <p className="text-eyebrow">Pedir contacto</p>
          <div className="mt-3">
            <LeadForm source="consultor" submitLabel="Pedir que o consultor me contacte" />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
