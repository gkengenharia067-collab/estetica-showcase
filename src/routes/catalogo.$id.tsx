import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Leaf, MapPin, ShieldCheck, Truck, ChevronRight, Info, Plus, Minus, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CartDrawer } from "@/components/CartDrawer";

export const Route = createFileRoute("/catalogo/$id")({
  component: ProdutoDetalhesPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1595859703065-cc958019e07b?w=1200&q=80";

function getFazenda() {
  try {
    const saved = localStorage.getItem('@mr/fazenda');
    return saved ? JSON.parse(saved) : { nome: 'Terra Viva', cidade: 'Serra do Vale, MG', descricao: '', whatsapp: '' };
  } catch {
    return { nome: 'Terra Viva', cidade: 'Serra do Vale, MG', descricao: '', whatsapp: '' };
  }
}

function getFullDescription(nome: string, categoria: string) {
  const map: Record<string, string> = {
    "Tomate orgânico": "Nossos tomates são cultivados em solo rico e orgânico, sem adição de produtos químicos. Eles amadurecem no pé, garantindo um sabor adocicado, coloração vibrante e textura suculenta. Perfeitos para molhos artesanais, saladas frescas ou para comer como petisco.",
    "Mel artesanal": "Extraído a frio das nossas próprias colmeias silvestres, localizadas na reserva ambiental da propriedade. É um mel cru, que preserva todas as enzimas, vitaminas e sabor floral único da nossa região. Um verdadeiro néctar da natureza.",
    "Ovos caipiras": "Ovos de galinhas livres, que ciscam pelo pomar e recebem uma alimentação equilibrada, natural e sem antibióticos. A gema possui uma cor intensa e um sabor inigualável, trazendo mais saúde e qualidade para suas receitas de família.",
  };
  return map[nome] || `Este maravilhoso produto da categoria ${categoria.toLowerCase()} é produzido com muito zelo, seguindo os rigorosos padrões de qualidade da nossa fazenda. Ideal para a sua família.`;
}

function ProdutoDetalhesPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { produtos, addToCart, cart } = useStore();
  const produto = produtos.find((p) => p.id === id);
  const fazenda = getFazenda();

  const goBackToCatalogo = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/catalogo" });
    }
  };

  const [qtd, setQtd] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const itemNoCarrinho = cart.find((c) => c.id === id);

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center bg-card p-10 rounded-2xl shadow-sm border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
          <Link to="/catalogo" className="text-primary hover:underline font-medium">
            &larr; Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  function handleAdd() {
    addToCart(produto!, qtd);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            <ArrowLeft className="size-4" />
            Voltar ao painel
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Leaf className="size-4" />
            </div>
            <div className="font-display font-semibold text-lg text-foreground tracking-tight">{fazenda.nome}</div>
          </div>
        </div>
      </header>

      {/* 🔥 SACOLA STICKY NO TOPO */}
      <CartDrawer onOpenChange={setCartOpen} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/catalogo" className="hover:text-primary transition-colors">Início</Link>
          <ChevronRight className="size-4" />
          <span>{produto.categoria}</span>
          <ChevronRight className="size-4" />
          <span className="text-foreground font-medium">{produto.nome}</span>
        </div>

        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* Product Image */}
          <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full bg-muted">
            <img 
              src={produto.imagem || FALLBACK_IMG} 
              alt={produto.nome}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {produto.estoque === 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                <span className="bg-destructive text-destructive-foreground px-6 py-2 rounded-full text-lg font-bold tracking-widest uppercase shadow-md">
                  Esgotado
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5 w-fit">
              {produto.categoria}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              {produto.nome}
            </h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl md:text-5xl font-display font-bold text-primary">
                {formatBRL(produto.preco)}
              </span>
              <span className="text-xl text-muted-foreground font-medium">/ {produto.unidade}</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {getFullDescription(produto.nome, produto.categoria)}
            </p>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-accent/40 border border-border">
                <ShieldCheck className="size-6 text-primary mb-1" />
                <span className="font-semibold text-foreground">100% Qualidade</span>
                <span className="text-xs text-muted-foreground">Garantia da fazenda</span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-accent/40 border border-border">
                <Truck className="size-6 text-primary mb-1" />
                <span className="font-semibold text-foreground">Entrega Local</span>
                <span className="text-xs text-muted-foreground">Direto na sua porta</span>
              </div>
            </div>

            {/* Producer Info */}
            <Link 
              to="/produtor/fazenda-boa-terra"
              className="group flex items-center justify-between mt-auto mb-8 border-t border-b border-border py-6 hover:bg-accent/40 transition-colors px-4 -mx-4 rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100&h=100&fit=crop&q=80" 
                  alt={fazenda.nome}
                  className="size-14 rounded-full border-2 border-border shadow-sm object-cover group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{fazenda.nome}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="size-4" /> {fazenda.cidade || "Serra do Vale, MG"}
                  </div>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            {/* CTA */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {produto.estoque > 0 ? (
                  <span className="flex items-center gap-1.5 text-primary font-medium text-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    Em estoque ({produto.estoque} disponíveis)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-destructive font-medium text-sm">
                    <Info className="size-4" />
                    Sem estoque no momento
                  </span>
                )}
              </div>
              
              {produto.estoque > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-foreground">Quantidade:</span>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQtd((q) => Math.max(1, q - 1))}
                      className="size-10 flex items-center justify-center hover:bg-muted disabled:opacity-40"
                      disabled={qtd <= 1}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">{qtd}</span>
                    <button
                      type="button"
                      onClick={() => setQtd((q) => Math.min(produto.estoque, q + 1))}
                      className="size-10 flex items-center justify-center hover:bg-muted disabled:opacity-40"
                      disabled={qtd >= produto.estoque}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  {mounted && itemNoCarrinho && (
                    <span className="text-xs text-muted-foreground">
                      {itemNoCarrinho.quantidade} já na sacola
                    </span>
                  )}
                </div>
              )}

              <button
                disabled={produto.estoque === 0}
                onClick={handleAdd}
                className={`w-full flex items-center justify-center gap-3 py-4 md:py-5 rounded-2xl font-bold text-lg transition-all ${
                  produto.estoque > 0
                    ? added
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-primary text-primary-foreground shadow-lg hover:opacity-90 active:scale-[0.98]"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="size-5" />
                    Adicionado à sacola!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-5" />
                    Adicionar à sacola
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      {!cartOpen && <FloatingWhatsApp />}
    </div>
  );
}
