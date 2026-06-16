import { createContext, useContext, useState, type ReactNode } from "react";

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  unidade: string;
  categoria: string;
  emoji: string;
};

export type StatusPedido = "Pendente" | "Entregue";

export type Pedido = {
  id: string;
  cliente: string;
  produto: string;
  quantidade: string;
  valor: number;
  data: string;
  status: StatusPedido;
};

const produtosIniciais: Produto[] = [
  { id: "p1", nome: "Tomate orgânico", preco: 8, estoque: 45, unidade: "kg", categoria: "Hortaliças", emoji: "🍅" },
  { id: "p2", nome: "Mel artesanal", preco: 35, estoque: 12, unidade: "pote 500g", categoria: "Apicultura", emoji: "🍯" },
  { id: "p3", nome: "Ovos caipiras", preco: 22, estoque: 30, unidade: "dúzia", categoria: "Aves", emoji: "🥚" },
];

const pedidosIniciais: Pedido[] = [
  { id: "o1", cliente: "João Silva", produto: "Tomate orgânico", quantidade: "5 kg", valor: 40, data: "14/06", status: "Pendente" },
  { id: "o2", cliente: "Maria Souza", produto: "Mel artesanal", quantidade: "2 potes", valor: 70, data: "13/06", status: "Pendente" },
  { id: "o3", cliente: "Pedro Lima", produto: "Ovos caipiras", quantidade: "3 dúzias", valor: 66, data: "12/06", status: "Entregue" },
  { id: "o4", cliente: "Ana Oliveira", produto: "Tomate orgânico", quantidade: "10 kg", valor: 80, data: "11/06", status: "Entregue" },
  { id: "o5", cliente: "Carlos Mendes", produto: "Mel artesanal", quantidade: "1 pote", valor: 35, data: "10/06", status: "Pendente" },
];

type Ctx = {
  produtos: Produto[];
  pedidos: Pedido[];
  addProduto: (p: Omit<Produto, "id" | "emoji"> & { emoji?: string }) => void;
  updateProduto: (id: string, p: Omit<Produto, "id" | "emoji"> & { emoji?: string }) => void;
  deleteProduto: (id: string) => void;
  marcarEntregue: (id: string) => void;
  vendasPeriodo: number;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciais);

  const value: Ctx = {
    produtos,
    pedidos,
    addProduto: (p) =>
      setProdutos((prev) => [
        ...prev,
        { id: crypto.randomUUID(), emoji: p.emoji || "🌱", ...p },
      ]),
    updateProduto: (id, p) =>
      setProdutos((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...p, emoji: p.emoji || x.emoji } : x)),
      ),
    deleteProduto: (id) => setProdutos((prev) => prev.filter((x) => x.id !== id)),
    marcarEntregue: (id) =>
      setPedidos((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Entregue" } : o))),
    vendasPeriodo: 850,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
