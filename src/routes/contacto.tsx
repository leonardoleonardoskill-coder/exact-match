import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site/PublicLayout";
import { LeadForm } from "@/components/site/LeadForm";
import { Button } from "@/components/ui/button";
import { settingsQuery } from "@/lib/queries";
import { whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Grupo Só Vendas" },
      {
        name: "description",
        content:
          "Fale com o Grupo Só Vendas ou diga o que procura: tipo de bem, zona em Angola e orçamento.",
      },
      { property: "og:title", content: "Contacto — Grupo Só Vendas" },
      {
        property: "og:description",
        content: "Envie o seu pedido e o consultor entra em contacto.",
      },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  const { data: settings } = useQuery(settingsQuery);
  const wa = whatsappLink(settings?.["whatsapp_number"], "Olá, gostaria de falar sobre uma procura.");

  return (
    <PublicLayout>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-eyebrow">Contacto</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold">Diga-nos o que procura</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Indique o tipo de bem, a zona e o orçamento. Se ainda não estiver publicado, o consultor
            procura e avisa quando surgir.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>Consultor: {settings?.["consultant_name"] || "Leonardo Jimi"}</li>
            {settings?.["contact_phone"] && <li>Telefone: {settings["contact_phone"]}</li>}
            {settings?.["contact_email"] && <li>Email: {settings["contact_email"]}</li>}
          </ul>

          {wa && (
            <Button asChild className="mt-6 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
              <a href={wa} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
            </Button>
          )}
        </div>

        <LeadForm source="formulario" />
      </div>
    </PublicLayout>
  );
}
