import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ClipboardList, Package, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Terra Viva" },
      { name: "description", content: "Resumo da sua propriedade rural." },
    ],
  }),
  component: Dashboard,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Dashboard() {
  const { produtos, pedidos, vendasPeriodo } = useStore();
  const pendentes = pedidos.filter((p) => p.status === "Pendente").length;

  return (
    <AppShell>
      <section className="mb-8">
        <div className="text-sm text-muted-foreground">Bem-vindo de volta 👋</div>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Fazenda Boa Terra</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Aqui está um resumo da sua produção e dos pedidos recentes dos seus clientes.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard
          label="Produtos cadastrados"
          value={String(produtos.length)}
          icon={<Package className="size-5" />}
          tint="primary"
        />
        <StatCard
          label="Pedidos recebidos"
          value={String(pedidos.length)}
          icon={<ShoppingBag className="size-5" />}
          tint="earth"
          hint={`${pendentes} pendente${pendentes === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Vendas do período"
          value={formatBRL(vendasPeriodo)}
          icon={<TrendingUp className="size-5" />}
          tint="soft"
          hint="Últimos 30 dias"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <ShortcutCard
          to="/produtos"
          title="Adicionar Produto"
          desc="Cadastre um novo produto da sua propriedade."
          icon={<Plus className="size-6" />}
          accent="primary"
        />
        <ShortcutCard
          to="/pedidos"
          title="Ver Pedidos"
          desc="Acompanhe e marque pedidos como entregues."
          icon={<ClipboardList className="size-6" />}
          accent="earth"
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Pedidos recentes</h2>
          <Link to="/pedidos" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          {pedidos.slice(0, 4).map((p, i) => (
            <div
              key={p.id}
              className={
                "flex items-center justify-between px-5 py-4 " +
                (i !== 0 ? "border-t border-border" : "")
              }
            >
              <div>
                <div className="font-medium">{p.cliente}</div>
                <div className="text-sm text-muted-foreground">
                  {p.produto} · {p.quantidade}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatBRL(p.valor)}</div>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  tint,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tint: "primary" | "earth" | "soft";
  hint?: string;
}) {
  const tints = {
    primary: "bg-primary text-primary-foreground",
    earth: "bg-earth text-earth-foreground",
    soft: "bg-primary-soft text-primary-foreground",
  };
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-3xl font-semibold mt-2 font-display">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className={"size-11 rounded-xl flex items-center justify-center " + tints[tint]}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ShortcutCard({
  to,
  title,
  desc,
  icon,
  accent,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: "primary" | "earth";
}) {
  const ring = accent === "primary" ? "bg-primary text-primary-foreground" : "bg-earth text-earth-foreground";
  return (
    <Link
      to={to}
      className="group rounded-2xl bg-card border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
    >
      <div className={"size-12 rounded-xl flex items-center justify-center " + ring}>{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}

function StatusBadge({ status }: { status: "Pendente" | "Entregue" }) {
  const cls =
    status === "Entregue"
      ? "bg-success/15 text-success border border-success/30"
      : "bg-warning/20 text-warning-foreground border border-warning/40";
  return (
    <span className={"inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full " + cls}>
      {status}
    </span>
  );
}
