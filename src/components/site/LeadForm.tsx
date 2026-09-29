import { useState } from "react";
import { toast } from "sonner";
import { createLead } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  listingId?: string | null;
  source?: "anuncio" | "formulario" | "consultor";
  defaultMessage?: string;
  submitLabel?: string;
};

export function LeadForm({
  listingId = null,
  source = "formulario",
  defaultMessage = "",
  submitLabel = "Enviar pedido de contacto",
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Indique o seu nome e telefone.");
      return;
    }
    setSending(true);
    try {
      await createLead({ name, phone, email, message, listing_id: listingId, source });
      setSent(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage(defaultMessage);
      toast.success("Pedido enviado. O consultor entrará em contacto.");
    } catch {
      toast.error("Não foi possível enviar. Tente novamente ou use o WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="font-display text-lg font-bold">Pedido recebido</p>
        <p className="mt-2 text-sm text-muted-foreground">
          O consultor irá contactá-lo pelo número indicado. Para resposta mais rápida, use o WhatsApp.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
          Enviar outro pedido
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lead-name">Nome *</Label>
          <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lead-phone">Telefone *</Label>
          <Input
            id="lead-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+244 9XX XXX XXX"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lead-email">Email (opcional)</Label>
        <Input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lead-message">Mensagem</Label>
        <Textarea
          id="lead-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Diga-nos o que procura: tipo de bem, zona e orçamento."
        />
      </div>
      <Button type="submit" disabled={sending} className="w-full">
        {sending ? "A enviar..." : submitLabel}
      </Button>
    </form>
  );
}
