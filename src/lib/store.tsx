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

type Ctx = {
  produtos: Produto[];
  pedidos: Pedido[];
  addProduto: (p: Omit<Produto, "id" | "imagem"> & { imagem?: string }) => void;
  updateProduto: (id: string, p: Omit<Produto, "id" | "imagem"> & { imagem?: string }) => void;
  deleteProduto: (id: string) => void;
  alterarStatusPedido: (id: string, status: StatusPedido) => void;
  addPedido: (pedido: Omit<Pedido, "id" | "data" | "status">) => void;
  vendasPeriodo: number;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    try {
      const saved = localStorage.getItem("@mr/produtos.v2");
      return saved ? JSON.parse(saved) : produtosIniciais;
    } catch {
      return produtosIniciais;
    }
  });

  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    try {
      const saved = localStorage.getItem("@mr/pedidos");
      return saved ? JSON.parse(saved) : pedidosIniciais;
    } catch {
      return pedidosIniciais;
    }
  });

  const [vendasPeriodo, setVendasPeriodo] = useState(() => {
    try {
      const saved = localStorage.getItem("@mr/vendas");
      return saved ? JSON.parse(saved) : 850;
    } catch {
      return 850;
    }
  });

  useEffect(() => {
    localStorage.setItem("@mr/produtos.v2", JSON.stringify(produtos));
  }, [produtos]);
  
  useEffect(() => {
    localStorage.setItem("@mr/pedidos", JSON.stringify(pedidos));
    const novasVendas = pedidos.filter(p => p.status === "Entregue").reduce((acc, p) => acc + p.valor, 0) || 850;
    setVendasPeriodo(novasVendas);
    localStorage.setItem("@mr/vendas", JSON.stringify(novasVendas));
  }, [pedidos]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "@mr/pedidos" && e.newValue) {
        setPedidos(JSON.parse(e.newValue));
      }
      if (e.key === "@mr/produtos.v2" && e.newValue) {
        setProdutos(JSON.parse(e.newValue));
      }
      if (e.key === "@mr/vendas" && e.newValue) {
        setVendasPeriodo(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value: Ctx = {
    produtos,
    pedidos,
    addProduto: (p) =>
      setProdutos((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...p, imagem: p.imagem || "" },
      ]),
    updateProduto: (id, p) =>
      setProdutos((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...p, imagem: p.imagem ?? x.imagem } : x)),
      ),
    deleteProduto: (id) => setProdutos((prev) => prev.filter((x) => x.id !== id)),
    alterarStatusPedido: (id, status) =>
      setPedidos((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    addPedido: (p) => {
      const novoPedido: Pedido = {
        ...p,
        id: crypto.randomUUID(),
        data: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        status: "Pendente",
      };
      setPedidos((prev) => [novoPedido, ...prev]);
    },
    vendasPeriodo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
