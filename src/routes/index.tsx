import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <section className="mb-8">
        <div className="text-sm text-muted-foreground">Bem-vindo de volta 👋</div>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Fazenda Boa Terra</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Aqui está um resumo da sua produção e dos pedidos recentes dos seus clientes.
        </p>
      </section>

      {/* Stat Cards estáticos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm text-muted-foreground">Produtos cadastrados</div>
          <div className="text-3xl font-semibold mt-2 font-display">3</div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm text-muted-foreground">Pedidos recebidos</div>
          <div className="text-3xl font-semibold mt-2 font-display">3</div>
          <div className="text-xs text-muted-foreground mt-1">2 pendentes</div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm text-muted-foreground">Vendas do período</div>
          <div className="text-3xl font-semibold mt-2 font-display">R$ 850,00</div>
          <div className="text-xs text-muted-foreground mt-1">Últimos 30 dias</div>
        </div>
      </section>

      {/* Atalhos estáticos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <a
          href="/produtos"
          className="group rounded-2xl bg-card border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
        >
          <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl">+</div>
          <div className="flex-1">
            <div className="font-semibold text-lg">Adicionar Produto</div>
            <div className="text-sm text-muted-foreground">Cadastre um novo produto da sua propriedade.</div>
          </div>
        </a>
        <a
          href="/pedidos"
          className="group rounded-2xl bg-card border border-border p-5 flex items-center gap-4 hover:border-primary transition-colors"
        >
          <div className="size-12 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xl">📋</div>
          <div className="flex-1">
            <div className="font-semibold text-lg">Ver Pedidos</div>
            <div className="text-sm text-muted-foreground">Acompanhe e marque pedidos como entregues.</div>
          </div>
        </a>
      </section>
    </div>
  );
}
