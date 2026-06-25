import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ShoppingBag, Leaf, Save, CheckCircle, Upload, Link2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function DashboardPage() {
  const { produtos, pedidos } = useStore();

  const [fazenda, setFazenda] = useState(() => {
    try {
      const saved = localStorage.getItem('@mr/fazenda');
      return saved ? JSON.parse(saved) : { 
        nome: '', 
        telefone: '', 
        cidade: '', 
        descricao: '', 
        whatsapp: '',
        logo: '',
        capa: ''
      };
    } catch {
      return { 
        nome: '', 
        telefone: '', 
        cidade: '', 
        descricao: '', 
        whatsapp: '',
        logo: '',
        capa: ''
      };
    }
  });

  const [salvo, setSalvo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const capaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('@mr/fazenda', JSON.stringify(fazenda));
  }, [fazenda]);

  useEffect(() => {
    if (salvo) {
      const timer = setTimeout(() => setSalvo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [salvo]);

  const totalProdutos = produtos.length;
  const pedidosPendentes = pedidos.filter(p => p.status === "Pendente").length;
  const totalVendas = pedidos.reduce((acc, p) => acc + p.valor, 0);

  const handleSave = () => {
    localStorage.setItem('@mr/fazenda', JSON.stringify(fazenda));
    setSalvo(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFazenda({ ...fazenda, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFazenda({ ...fazenda, capa: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Leaf className="size-5" />
            </div>
            <div className="font-display font-bold text-xl text-foreground tracking-tight">Terra Viva</div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="text-primary font-semibold">Dashboard</Link>
            <Link to="/pedidos" className="hover:text-foreground cursor-pointer transition-colors">Pedidos</Link>
            <Link to="/produtos" className="hover:text-foreground cursor-pointer transition-colors">Meus Produtos</Link>
            <Link to="/catalogo" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-sm">
              Ver minha loja
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Produtos cadastrados</h3>
              <ShoppingBag className="size-5 text-primary" />
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{totalProdutos}</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pedidos pendentes</h3>
              <ShoppingBag className="size-5 text-primary" />
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{pedidosPendentes}</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Vendas do período</h3>
              <ShoppingBag className="size-5 text-primary" />
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{formatBRL(totalVendas)}</p>
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="size-5" />
            Adicionar Produto
          </Link>
          <Link
            to="/pedidos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-bold hover:bg-muted transition-all"
          >
            <ShoppingBag className="size-5" />
            Ver Pedidos
          </Link>
        </div>

        {/* Card "Minha Fazenda" com upload + URL para logo e capa */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-bold text-foreground">Minha Fazenda</h2>
            {salvo && (
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <CheckCircle className="size-4" />
                Dados salvos!
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-4">Preencha os dados da sua propriedade para aparecer na loja.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome da fazenda</label>
              <input
                type="text"
                value={fazenda.nome}
                onChange={(e) => setFazenda({ ...fazenda, nome: e.target.value })}
                className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Ex: Fazenda Boa Terra"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Telefone</label>
              <input
                type="text"
                value={fazenda.telefone}
                onChange={(e) => setFazenda({ ...fazenda, telefone: e.target.value })}
                className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="(00) 0000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Cidade</label>
              <input
                type="text"
                value={fazenda.cidade}
                onChange={(e) => setFazenda({ ...fazenda, cidade: e.target.value })}
                className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Ex: Campo Grande - MS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp</label>
              <input
                type="text"
                value={fazenda.whatsapp}
                onChange={(e) => setFazenda({ ...fazenda, whatsapp: e.target.value })}
                className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
            <textarea
              value={fazenda.descricao}
              onChange={(e) => setFazenda({ ...fazenda, descricao: e.target.value })}
              className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary resize-none h-24"
              placeholder="Conte um pouco sobre sua fazenda..."
            />
          </div>

          {/* 🔥 LOGO – URL + Upload */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Logo da fazenda</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link2 className="size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={fazenda.logo?.startsWith('data:') ? '' : fazenda.logo || ''}
                    onChange={(e) => setFazenda({ ...fazenda, logo: e.target.value })}
                    className="flex-1 border border-border rounded-xl bg-background px-4 py-2 outline-none focus:border-primary text-sm"
                    placeholder="URL da logo (ex: https://...)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="size-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-all text-sm"
                  >
                    Escolher arquivo
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {fazenda.logo && (
                    <span className="text-sm text-green-600">✓</span>
                  )}
                </div>
                {fazenda.logo && (
                  <div className="mt-2">
                    <img src={fazenda.logo} alt="Logo" className="h-12 w-auto object-contain" />
                  </div>
                )}
              </div>
            </div>

            {/* 🔥 CAPA – URL + Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Foto de capa</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link2 className="size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={fazenda.capa?.startsWith('data:') ? '' : fazenda.capa || ''}
                    onChange={(e) => setFazenda({ ...fazenda, capa: e.target.value })}
                    className="flex-1 border border-border rounded-xl bg-background px-4 py-2 outline-none focus:border-primary text-sm"
                    placeholder="URL da capa (ex: https://...)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="size-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => capaInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-all text-sm"
                  >
                    Escolher arquivo
                  </button>
                  <input
                    ref={capaInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCapaUpload}
                    className="hidden"
                  />
                  {fazenda.capa && (
                    <span className="text-sm text-green-600">✓</span>
                  )}
                </div>
                {fazenda.capa && (
                  <div className="mt-2">
                    <img src={fazenda.capa} alt="Capa" className="h-20 w-full object-cover rounded-xl" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
            >
              <Save className="size-5" />
              Salvar dados
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
