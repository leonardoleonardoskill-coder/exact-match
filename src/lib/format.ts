export function formatKwanza(price: number | null | undefined, onRequest?: boolean): string {
  if (onRequest || price === null || price === undefined) return "Preço sob consulta";
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function formatNumber(value: number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined) return "—";
  return `${new Intl.NumberFormat("pt-AO").format(Number(value))}${suffix}`;
}

export const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  arrendado: "Arrendado",
};

export const PURPOSE_LABEL: Record<string, string> = {
  venda: "Venda",
  arrendamento: "Arrendamento",
};

export const LEAD_STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_contacto: "Em contacto",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const LEAD_SOURCE_LABEL: Record<string, string> = {
  anuncio: "Anúncio",
  formulario: "Formulário",
  whatsapp: "WhatsApp",
  consultor: "Consultor",
};

export function whatsappLink(rawNumber: string | null | undefined, message: string): string | null {
  if (!rawNumber) return null;
  const digits = rawNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function locationLabel(location?: { province: string; municipality: string | null } | null) {
  if (!location) return "Localização a confirmar";
  return location.municipality ? `${location.municipality}, ${location.province}` : location.province;
}
