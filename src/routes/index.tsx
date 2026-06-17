import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Plus, ClipboardList, TrendingUp, Package, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/")({
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
      {/* Header */}
      <section className="mb-8">
        <div className="text-sm text-muted-foreground">Bem-vindo de volta 👋</div>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Fazenda Boa Terra</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Aqui está um resumo da sua produção e dos pedidos recentes dos seus clientes.
        </p>
      </section>

      {/* Stat Cards dinâmicos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-card border border-border p-5 flex items-start gap-4">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Package className="size-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Produtos cadastrados</div>
            <div className="text-3xl font-semibold mt-1 font-display">{produtos.length}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5 flex items-start gap-4">
          <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Pedidos recebidos</div>
            <div className="text-3xl font-semibold mt-1 font-display">{pedidos.length}</div>
            <div className="text-xs text-muted-foreground mt-1">{pendentes} pendente{pendentes === 1 ? "" : "s"}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5 flex items-start gap-4">
          <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Vendas do período</div>
            <div className="text-3xl font-semibold mt-1 font-display">{formatBRL(vendasPeriodo)}</div>
            <div className="text-xs text-muted-foreground mt-1">Últimos 30 dias</div>
          </div>
        </div>
      </section>

      {/* Atalhos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link
          to="/produtos"
          className="group rounded-2xl bg-card border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
        >
          <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl">
            <Plus className="size-6" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">Adicionar Produto</div>
            <div className="text-sm text-muted-foreground">Cadastre um novo produto da sua propriedade.</div>
          </div>
        </Link>
        <Link
          to="/pedidos"
          className="group rounded-2xl bg-card border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
        >
          <div className="size-12 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xl">
            <ClipboardList className="size-6" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">Ver Pedidos</div>
            <div className="text-sm text-muted-foreground">Acompanhe e marque pedidos como entregues.</div>
          </div>
        </Link>
      </section>

      {/* Resumo rápido de produtos e pedidos recentes */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos recentes */}
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Seus produtos</h2>
            <Link to="/produtos" className="text-sm text-primary font-medium hover:underline">
              Ver todos
            </Link>
          </div>
          {produtos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {produtos.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden>{p.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{p.nome}</div>
                      <div className="text-xs text-muted-foreground">Estoque: {p.estoque} {p.unidade}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{formatBRL(p.preco)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pedidos recentes */}
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Pedidos recentes</h2>
            <Link to="/pedidos" className="text-sm text-primary font-medium hover:underline">
              Ver todos
            </Link>
          </div>
          {pedidos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido recebido ainda.</p>
          ) : (
            <div className="space-y-3">
              {pedidos.slice(0, 4).map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{o.cliente}</div>
                    <div className="text-xs text-muted-foreground">{o.produto} · {o.quantidade}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatBRL(o.valor)}</div>
                    <div className={
                      "text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 " +
                      (o.status === "Entregue"
                        ? "bg-green-100 text-green-800"
                        : o.status === "Em preparação"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800")
                    }>
                      {o.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
