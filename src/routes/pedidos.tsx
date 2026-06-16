import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos — Terra Viva" },
      { name: "description", content: "Acompanhe os pedidos dos seus clientes." },
    ],
  }),
  component: PedidosPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function PedidosPage() {
  const { pedidos, marcarEntregue } = useStore();
  const pendentes = pedidos.filter((p) => p.status === "Pendente").length;
  const entregues = pedidos.length - pendentes;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold">Pedidos</h1>
        <p className="text-muted-foreground mt-2">
          {pendentes} pendente{pendentes === 1 ? "" : "s"} · {entregues} entregue{entregues === 1 ? "" : "s"}
        </p>
      </div>

      {/* Tabela desktop */}
      <div className="hidden md:block rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/60 text-sm text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Produto</th>
              <th className="px-5 py-3 font-medium">Quantidade</th>
              <th className="px-5 py-3 font-medium">Valor</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p, i) => (
              <tr key={p.id} className={i !== 0 ? "border-t border-border" : ""}>
                <td className="px-5 py-4 font-medium">{p.cliente}</td>
                <td className="px-5 py-4">{p.produto}</td>
                <td className="px-5 py-4">{p.quantidade}</td>
                <td className="px-5 py-4 font-semibold">{formatBRL(p.valor)}</td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4 text-right">
                  {p.status === "Pendente" ? (
                    <button
                      onClick={() => marcarEntregue(p.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Check className="size-4" /> Marcar como Entregue
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden space-y-3">
        {pedidos.map((p) => (
          <div key={p.id} className="rounded-2xl bg-card border border-border p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{p.cliente}</div>
                <div className="text-sm text-muted-foreground">{p.data}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="mt-3 text-sm">
              <div><span className="text-muted-foreground">Produto:</span> {p.produto}</div>
              <div><span className="text-muted-foreground">Qtd:</span> {p.quantidade}</div>
              <div className="mt-1 text-lg font-semibold text-primary">{formatBRL(p.valor)}</div>
            </div>
            {p.status === "Pendente" && (
              <button
                onClick={() => marcarEntregue(p.id)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Check className="size-4" /> Marcar como Entregue
              </button>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "Pendente" | "Entregue" }) {
  const cls =
    status === "Entregue"
      ? "bg-success/15 text-success border-success/30"
      : "bg-warning/20 text-warning-foreground border-warning/40";
  return (
    <span className={"inline-block text-xs font-medium px-2.5 py-1 rounded-full border " + cls}>
      {status}
    </span>
  );
}
