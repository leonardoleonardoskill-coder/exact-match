import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { whatsappLink } from "@/lib/format";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/imoveis", label: "Imóveis" },
  { to: "/viaturas", label: "Viaturas" },
  { to: "/consultor", label: "Consultor" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useQuery(settingsQuery);
  const wa = whatsappLink(settings?.["whatsapp_number"], "Olá, vim pelo site do Grupo Só Vendas.");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-display text-sm font-extrabold text-primary-foreground">
            SV
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-extrabold uppercase tracking-tight">
              Grupo Só Vendas
            </span>
            <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              Intermediação · Angola
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {wa && (
            <Button asChild className="hidden bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 md:inline-flex">
              <a href={wa} target="_blank" rel="noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="rounded-md p-2 text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="mt-2 mb-3 rounded-md bg-whatsapp px-3 py-3 text-center text-sm font-semibold text-whatsapp-foreground"
              >
                Falar no WhatsApp
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
