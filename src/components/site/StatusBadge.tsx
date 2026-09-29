import { STATUS_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  disponivel: "bg-success text-success-foreground",
  reservado: "bg-warning text-warning-foreground",
  vendido: "bg-primary text-primary-foreground",
  arrendado: "bg-primary text-primary-foreground",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider",
        STYLES[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
