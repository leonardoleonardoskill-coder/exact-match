import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-extrabold">Grupo Só Vendas</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Intermediação de imóveis, terrenos, espaços comerciais e viaturas em Angola.
          </p>
        </div>

        <div>
          <p className="text-eyebrow">Navegar</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/imoveis" className="text-muted-foreground hover:text-foreground">Imóveis</Link></li>
            <li><Link to="/viaturas" className="text-muted-foreground hover:text-foreground">Viaturas</Link></li>
            <li><Link to="/consultor" className="text-muted-foreground hover:text-foreground">Consultor</Link></li>
            <li><Link to="/sobre" className="text-muted-foreground hover:text-foreground">Sobre</Link></li>
            <li><Link to="/contacto" className="text-muted-foreground hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-eyebrow">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{settings?.["consultant_name"] || "Leonardo Jimi"}</li>
            {settings?.["contact_phone"] && <li>{settings["contact_phone"]}</li>}
            {settings?.["contact_email"] && <li>{settings["contact_email"]}</li>}
            {!settings?.["contact_phone"] && !settings?.["contact_email"] && (
              <li>Contactos a definir no painel de administração.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Grupo Só Vendas</span>
          <Link to="/entrar" className="hover:text-foreground">Área do administrador</Link>
        </div>
      </div>
    </footer>
  );
}
