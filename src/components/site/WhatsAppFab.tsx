import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { whatsappLink } from "@/lib/format";

export function WhatsAppFab({ message }: { message?: string }) {
  const { data: settings } = useQuery(settingsQuery);
  const href = whatsappLink(
    settings?.["whatsapp_number"],
    message ?? "Olá, vim pelo site do Grupo Só Vendas.",
  );
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
