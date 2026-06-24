import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  unidade: string;
  categoria: string;
  imagem: string;
};

export type StatusPedido = "Pendente" | "Em preparação" | "Entregue";

export type PedidoItem = {
  produto: string;
  quantidade: number;
  preco: number;
  unidade?: string;
  imagem?: string;
};

export type Pedido = {
  id: string;
  cliente: string;
  whatsapp?: string;
  observacao?: string;
  produto: string;
  quantidade: string;
  valor: number;
  data: string;
  status: StatusPedido;
  itens?: PedidoItem[];
};

export type CartItem = {
  id: string;
  nome: string;
  preco: number;
  unidade: string;
  imagem: string;
  estoque: number;
  quantidade: number;
};

const produtosIniciais: Produto[] = [
  { id: "p1", nome: "Tomate orgânico", preco: 8, estoque: 45, unidade: "kg", categoria: "Hortaliças", imagem: "https://images.unsplash.com/photo-1623375477547-c73c4f274922?q=80&w=1219&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p2", nome: "Mel artesanal", preco: 35, estoque: 12, unidade: "pote 500g", categoria: "Apicultura", imagem: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p3", nome: "Ovos caipiras", preco: 22, estoque: 30, unidade: "dúzia", categoria: "Aves", imagem: "https://images.unsplash.com/photo-1477506410535-f12fe9af97cc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const pedidosIniciais: Pedido[] = [
  { id: "o1", cliente: "João Silva", produto: "Tomate orgânico", quantidade: "5", valor: 40, data: "14/06", status: "Pendente" },
  { id: "o2", cliente: "Maria Souza", produto: "Mel artesanal", quantidade: "2", valor: 70, data: "13/06", status: "Pendente" },
  { id: "o3", cliente: "Pedro Lima", produto: "Ovos caipiras", quantidade: "3", valor: 66, data: "12/06", status: "Entregue" },
];

type CheckoutInfo = { cliente: string; whatsapp?: string; observacao?: string };

type Ctx = {
  produtos: Produto[];
  pedidos: Pedido[];
  addProduto: (p: Omit<Produto, "id" | "imagem"> & { imagem?: string }) => void;
  updateProduto: (id: string, p: Omit<Produto, "id" | "imagem"> & { imagem?: string }) => void;
  deleteProduto: (id: string) => void;
  alterarStatusPedido: (id: string, status: StatusPedido) => void;
  addPedido: (pedido: Omit<Pedido, "id" | "data" | "status">) => void;
  vendasPeriodo: number;
  cart: CartItem[];
  addToCart: (produto: Produto, quantidade?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, quantidade: number) => void;
  clearCart: () => void;
  checkoutCart: (info: CheckoutInfo) => Pedido | null;
};

const StoreContext = createContext<Ctx | null>(null);

// 🔧 Função para gerar ID único (funciona em servidor e cliente)
function gerarId() {
  // fallback para ambiente sem crypto
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // 🔥 ESTADO INICIAL: usa produtosIniciais (mesmo no servidor)
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciais);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vendasPeriodo, setVendasPeriodo] = useState<number>(850);
  const [carregado, setCarregado] = useState(false);

  // 🔥 Carrega dados do localStorage APENAS no cliente (depois da montagem)
  useEffect(() => {
    try {
      const savedProdutos = localStorage.getItem("@mr/produtos.v2");
      if (savedProdutos) {
        const parsed = JSON.parse(savedProdutos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProdutos(parsed);
        }
      }
      const savedPedidos = localStorage.getItem("@mr/pedidos");
      if (savedPedidos) {
        const parsed = JSON.parse(savedPedidos);
        if (Array.isArray(parsed)) setPedidos(parsed);
      }
      const savedCart = localStorage.getItem("@mr/cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
      const savedVendas = localStorage.getItem("@mr/vendas");
      if (savedVendas) {
        const parsed = JSON.parse(savedVendas);
        if (typeof parsed === "number") setVendasPeriodo(parsed);
      }
    } catch (e) {
      console.warn("Erro ao carregar dados do localStorage", e);
    } finally {
      setCarregado(true);
    }
  }, []);

  // 🔥 Salva produtos no localStorage sempre que mudar
  useEffect(() => {
    if (carregado) {
      localStorage.setItem("@mr/produtos.v2", JSON.stringify(produtos));
    }
  }, [produtos, carregado]);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("@mr/pedidos", JSON.stringify(pedidos));
    }
  }, [pedidos, carregado]);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("@mr/cart", JSON.stringify(cart));
    }
  }, [cart, carregado]);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("@mr/vendas", JSON.stringify(vendasPeriodo));
    }
  }, [vendasPeriodo, carregado]);

  // 🔥 Sincronização entre abas
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "@mr/pedidos" && e.newValue) {
        try { setPedidos(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === "@mr/produtos.v2" && e.newValue) {
        try { setProdutos(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === "@mr/vendas" && e.newValue) {
        try { setVendasPeriodo(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === "@mr/cart" && e.newValue) {
        try { setCart(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addProduto = (p: Omit<Produto, "id" | "imagem"> & { imagem?: string }) => {
    const novo: Produto = {
      id: gerarId(),
      ...p,
      imagem: p.imagem || "",
    };
    setProdutos((prev) => [...prev, novo]);
  };

  const updateProduto = (id: string, p: Omit<Produto, "id" | "imagem"> & { imagem?: string }) => {
    setProdutos((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, ...p, imagem: p.imagem ?? x.imagem }
          : x
      )
    );
  };

  const deleteProduto = (id: string) => {
    setProdutos((prev) => prev.filter((x) => x.id !== id));
  };

  const alterarStatusPedido = (id: string, status: StatusPedido) => {
    setPedidos((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const addPedido = (p: Omit<Pedido, "id" | "data" | "status">) => {
    const novoPedido: Pedido = {
      ...p,
      id: gerarId(),
      data: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      status: "Pendente",
    };
    setPedidos((prev) => [novoPedido, ...prev]);
    // atualiza vendas
    const totalVendas = pedidos.filter(p => p.status === "Entregue").reduce((acc, o) => acc + o.valor, 0);
    setVendasPeriodo(totalVendas || 850);
  };

  const addToCart = (produto: Produto, quantidade = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === produto.id);
      if (existing) {
        const novaQtd = Math.min(existing.quantidade + quantidade, produto.estoque);
        return prev.map((c) => (c.id === produto.id ? { ...c, quantidade: novaQtd } : c));
      }
      return [
        ...prev,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          unidade: produto.unidade,
          imagem: produto.imagem,
          estoque: produto.estoque,
          quantidade: Math.min(quantidade, produto.estoque),
        },
      ];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id));

  const updateCartQty = (id: string, quantidade: number) => {
    setCart((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, quantidade: Math.max(1, Math.min(quantidade, c.estoque)) } : c
      )
    );
  };

  const clearCart = () => setCart([]);

  const checkoutCart = (info: CheckoutInfo) => {
    if (cart.length === 0) return null;
    const itens: PedidoItem[] = cart.map((c) => ({
      produto: c.nome,
      quantidade: c.quantidade,
      preco: c.preco,
      unidade: c.unidade,
      imagem: c.imagem,
    }));
    const valor = itens.reduce((acc, it) => acc + it.preco * it.quantidade, 0);
    const totalQtd = itens.reduce((acc, it) => acc + it.quantidade, 0);
    const produtoLabel =
      itens.length === 1
        ? itens[0].produto
        : `${itens[0].produto} +${itens.length - 1} ${itens.length - 1 === 1 ? "item" : "itens"}`;
    const novoPedido: Pedido = {
      id: gerarId(),
      cliente: info.cliente,
      whatsapp: info.whatsapp,
      observacao: info.observacao,
      produto: produtoLabel,
      quantidade: String(totalQtd),
      valor,
      data: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      status: "Pendente",
      itens,
    };
    setPedidos((prev) => [novoPedido, ...prev]);
    setCart([]);
    return novoPedido;
  };

  const value: Ctx = {
    produtos,
    pedidos,
    addProduto,
    updateProduto,
    deleteProduto,
    alterarStatusPedido,
    addPedido,
    vendasPeriodo,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    checkoutCart,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
