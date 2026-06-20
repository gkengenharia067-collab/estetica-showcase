import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, MapPin, ShieldCheck, Truck, Plus } from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CartDrawer } from "@/components/CartDrawer";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/catalogo/")({
  component: CatalogoPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1595859703065-cc958019e07b?w=800&q=80";


function getShortDescription(categoria: string) {
  const map: Record<string, string> = {
    "Hortaliças": "Colhido no dia, livre de agrotóxicos.",
    "Apicultura": "Puro, cru e processado artesanalmente.",
    "Aves": "Galinhas criadas soltas com alimentação natural.",
  };
  return map[categoria] || "Produto fresco direto da fazenda para sua mesa.";
}

function CatalogoPage() {
  const { produtos, addToCart } = useStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Leaf className="size-5" />
            </div>
            <div className="font-display font-bold text-xl text-foreground tracking-tight">Terra Viva</div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/catalogo" className="text-primary font-semibold">Início</Link>
            <a href="#produtos" className="hover:text-foreground cursor-pointer transition-colors">Produtos</a>
            <Link to="/produtor/fazenda-boa-terra" className="hover:text-foreground cursor-pointer transition-colors">Sobre a Fazenda</Link>
            <a href="#contato" className="hover:text-foreground cursor-pointer transition-colors">Contato</a>
          </nav>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex justify-end">
          <CartDrawer />
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-card border-b border-border overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&q=80" 
              alt="Fazenda Boa Terra" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              Produtor Verificado
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
              Fazenda Boa Terra
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Cultivando saúde e sabor desde 1998. Levamos até a sua mesa alimentos frescos, sustentáveis e repletos de carinho, direto de nossa propriedade na Serra do Vale.
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm text-foreground font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                Serra do Vale, MG
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Produção Própria
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-5 text-primary" />
                Entrega Semanal
              </div>
            </div>

            <div className="mt-10">
              <Link 
                to="/produtor/fazenda-boa-terra"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Conhecer a Fazenda
              </Link>
            </div>
          </div>
        </section>

        {/* Product Catalog */}
        <section id="produtos" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Nossos Produtos</h2>
              <p className="text-muted-foreground mt-2">Colhidos e preparados especialmente para você.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {produtos.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 bg-muted overflow-hidden">
                  <img 
                    src={p.imagem || FALLBACK_IMG} 
                    alt={p.nome} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.estoque === 0 && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                        Esgotado
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                      {p.categoria}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {p.nome}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {getShortDescription(p.categoria)}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-end gap-1 mb-4">
                      <span className="text-2xl font-display font-bold text-primary">
                        {formatBRL(p.preco)}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium mb-1">
                        / {p.unidade}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to="/catalogo/$id"
                        params={{ id: p.id }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-3 rounded-xl font-semibold border border-border hover:bg-muted transition-all text-sm"
                      >
                        Detalhes
                      </Link>
                      <button
                        type="button"
                        disabled={p.estoque === 0}
                        onClick={() => addToCart(p, 1)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl font-semibold transition-all text-sm ${
                          p.estoque > 0
                            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm hover:shadow-md"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        <Plus className="size-4" />
                        {p.estoque > 0 ? "Sacola" : "Indisponível"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contato" className="bg-card border-t border-border mt-10 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Entre em Contato</h2>
              <p className="text-muted-foreground mt-2">Fale diretamente com a fazenda para dúvidas ou encomendas especiais.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a href="https://wa.me/5567999222720" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center p-8 rounded-3xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                <div className="size-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">WhatsApp</h3>
                <p className="text-muted-foreground">+55 67 99922-2720</p>
                <p className="text-sm text-[#25D366] font-medium mt-2">Respostas em até 2 horas</p>
              </a>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-muted/30 border border-border">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <MapPin className="size-7" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">Localização</h3>
                <p className="text-muted-foreground">Estrada do Vale, Km 12</p>
                <p className="text-sm text-muted-foreground mt-2">Serra do Vale, MG</p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-muted/30 border border-border">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">Atendimento</h3>
                <p className="text-muted-foreground">Segunda a Sexta: 08h às 18h</p>
                <p className="text-sm text-muted-foreground mt-2">Sábados: 08h às 12h</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FloatingWhatsApp />
    </div>
  );
}
