import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Dashboard() {
  const { produtos, pedidos, vendasPeriodo } = useStore();
  const pendentes = pedidos.filter((p) => p.status === "Pendente").length;
  const recentes = pedidos.slice(0, 5);

  return (
    <AppShell>
      {/* Header */}
      <section className="mb-8">
        <div className="text-sm text-muted-foreground">Bem-vindo de volta 👋</div>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Fazenda Boa Terra</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Aqui está um resumo da sua produção e dos pedidos recentes dos seus clientes.
        </p>
      </section>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm text-muted-foreground">Produtos cadastrados</div>
          <div className="text-3xl font-semibold mt-2 font-display">{produtos.length}</div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm text-muted-foreground">Pedidos recebidos</div>
          <div className="text-3xl font-semibold mt-2 font-display">{pedidos.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {pendentes} pendente{pendentes === 1 ? "" : "s"}
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm text-muted-foreground">Vendas do período</div>
          <div className="text-3xl font-semibold mt-2 font-display">{formatBRL(vendasPeriodo)}</div>
          <div className="text-xs text-muted-foreground mt-1">Pedidos entregues</div>
        </div>
      </section>

      {/* Atalhos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link
          to="/produtos"
          className="group rounded-2xl bg-card border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
        >
          <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl">+</div>
          <div className="flex-1">
            <div className="font-semibold text-lg">Adicionar Produto</div>
            <div className="text-sm text-muted-foreground">Cadastre um novo produto da sua propriedade.</div>
          </div>
        </Link>
        <Link
          to="/pedidos"
          className="group rounded-2xl bg-card border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
        >
          <div className="size-12 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xl">📋</div>
          <div className="flex-1">
            <div className="font-semibold text-lg">Ver Pedidos</div>
            <div className="text-sm text-muted-foreground">Acompanhe e marque pedidos como entregues.</div>
          </div>
        </Link>
      </section>

      {/* Pedidos recentes */}
      {recentes.length > 0 && (
        <section className="rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pedidos recentes</h2>
            <Link to="/pedidos" className="text-sm text-primary hover:underline">Ver todos</Link>
          </div>
          <ul className="divide-y divide-border">
            {recentes.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.cliente}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.produto} · {p.data}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold">{formatBRL(p.valor)}</div>
                  <div className="text-xs text-muted-foreground">{p.status}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
