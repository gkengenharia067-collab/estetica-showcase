import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Sprout, ClipboardList, Menu, X, Leaf } from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/produtos", label: "Meus Produtos", icon: Sprout, exact: false },
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList, exact: false },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openMobile, setOpenMobile] = useState(false);

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <Brand />
        <NavList isActive={isActive} />
        <FazendaCard />
      </aside>

      {/* Sidebar mobile */}
      {openMobile && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpenMobile(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-card flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <Brand compact />
              <button
                onClick={() => setOpenMobile(false)}
                className="p-2 rounded-md hover:bg-muted"
                aria-label="Fechar menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <NavList isActive={isActive} onNavigate={() => setOpenMobile(false)} />
            <FazendaCard />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="md:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <Brand compact />
          <button
            onClick={() => setOpenMobile(true)}
            className="p-2 rounded-md hover:bg-muted"
            aria-label="Abrir menu"
          >
            <Menu className="size-6" />
          </button>
        </header>

        <main className="flex-1 px-4 md:px-10 py-6 md:py-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex items-center gap-2" : "flex items-center gap-3 px-5 py-6"}>
      <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
        <Leaf className="size-5" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-semibold text-foreground">Terra Viva</div>
        <div className="text-xs text-muted-foreground">Marketplace Rural</div>
      </div>
    </div>
  );
}

function NavList({
  isActive,
  onNavigate,
}: {
  isActive: (to: string, exact: boolean) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 px-3 py-2 space-y-1">
      {nav.map((item) => {
        const active = isActive(item.to, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={
              "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors " +
              (active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-muted")
            }
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function FazendaCard() {
  return (
    <div className="m-4 rounded-xl bg-accent/40 border border-border p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">Propriedade</div>
      <div className="font-display text-lg font-semibold mt-1">Fazenda Boa Terra</div>
      <div className="text-xs text-muted-foreground mt-1">Serra do Vale · MG</div>
    </div>
  );
}
