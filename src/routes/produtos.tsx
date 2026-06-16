import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useStore, type Produto } from "@/lib/store";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Meus Produtos — Terra Viva" },
      { name: "description", content: "Gerencie os produtos da sua propriedade." },
    ],
  }),
  component: ProdutosPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type FormState = {
  nome: string;
  preco: string;
  estoque: string;
  unidade: string;
  categoria: string;
  emoji: string;
};

const emptyForm: FormState = {
  nome: "",
  preco: "",
  estoque: "",
  unidade: "kg",
  categoria: "Hortaliças",
  emoji: "🌱",
};

function ProdutosPage() {
  const { produtos, addProduto, updateProduto, deleteProduto } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }
  function openEdit(p: Produto) {
    setEditing(p);
    setForm({
      nome: p.nome,
      preco: String(p.preco),
      estoque: String(p.estoque),
      unidade: p.unidade,
      categoria: p.categoria,
      emoji: p.emoji,
    });
    setOpen(true);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nome: form.nome.trim() || "Produto sem nome",
      preco: Number(form.preco) || 0,
      estoque: Number(form.estoque) || 0,
      unidade: form.unidade,
      categoria: form.categoria,
      emoji: form.emoji,
    };
    if (editing) updateProduto(editing.id, payload);
    else addProduto(payload);
    setOpen(false);
  }

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">Meus Produtos</h1>
          <p className="text-muted-foreground mt-2">
            {produtos.length} produto{produtos.length === 1 ? "" : "s"} cadastrado{produtos.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-5" /> Adicionar Produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {produtos.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col"
          >
            <div className="h-40 bg-accent/40 flex items-center justify-center text-7xl">
              <span aria-hidden>{p.emoji}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {p.categoria}
              </div>
              <h3 className="text-lg font-semibold mt-1">{p.nome}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-display font-semibold text-primary">
                  {formatBRL(p.preco)}
                </span>
                <span className="text-sm text-muted-foreground">/ {p.unidade}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Estoque: <span className="font-medium text-foreground">{p.estoque} {p.unidade}</span>
              </div>

              <div className="flex gap-2 mt-5 pt-4 border-t border-border">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-accent transition-colors"
                >
                  <Pencil className="size-4" /> Editar
                </button>
                <button
                  onClick={() => deleteProduto(p.id)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-destructive/30 text-destructive font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  aria-label={`Excluir ${p.nome}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 px-4 py-6">
          <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">
                {editing ? "Editar produto" : "Adicionar produto"}
              </h2>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-muted" aria-label="Fechar">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <Field label="Nome do produto">
                <input
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="input"
                  placeholder="Ex.: Alface crespa"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Preço (R$)">
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                    className="input"
                    placeholder="0,00"
                  />
                </Field>
                <Field label="Estoque">
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.estoque}
                    onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                    className="input"
                    placeholder="0"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Unidade">
                  <select
                    value={form.unidade}
                    onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                    className="input"
                  >
                    <option>kg</option>
                    <option>dúzia</option>
                    <option>pote 500g</option>
                    <option>unidade</option>
                    <option>maço</option>
                    <option>litro</option>
                  </select>
                </Field>
                <Field label="Categoria">
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="input"
                  >
                    <option>Hortaliças</option>
                    <option>Frutas</option>
                    <option>Apicultura</option>
                    <option>Aves</option>
                    <option>Laticínios</option>
                    <option>Grãos</option>
                  </select>
                </Field>
              </div>
              <Field label="Ícone">
                <div className="flex flex-wrap gap-2">
                  {["🍅","🍯","🥚","🥬","🥕","🍓","🌽","🥛","🐓","🌱"].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setForm({ ...form, emoji: e })}
                      className={
                        "size-10 rounded-lg text-2xl flex items-center justify-center border transition-colors " +
                        (form.emoji === e
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted")
                      }
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-border font-medium hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                >
                  {editing ? "Salvar alterações" : "Adicionar produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border-radius: 0.7rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          color: var(--color-foreground);
          font-size: 1rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 20%, transparent);
        }
      `}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
