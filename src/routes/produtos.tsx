import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Camera } from "lucide-react";
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
  imagem: string;
};

const emptyForm: FormState = {
  nome: "",
  preco: "",
  estoque: "",
  unidade: "kg",
  categoria: "Hortaliças",
  imagem: "",
};

const galeriaImagens: { nome: string; url: string }[] = [
  { nome: "Tomate", url: "https://images.unsplash.com/photo-1623375477547-c73c4f274922?q=80&w=1219&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Mel", url: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Ovos", url: "https://images.unsplash.com/photo-1477506410535-f12fe9af97cc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Alface", url: "https://images.unsplash.com/photo-1556781366-336f8353ba7c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Cenoura", url: "https://plus.unsplash.com/premium_photo-1661875719416-f2b30e95ea4a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Morango", url: "https://images.unsplash.com/photo-1716209290705-7333e99e3434?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Milho", url: "https://plus.unsplash.com/premium_photo-1725619408724-d2f8eedf8128?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Leite", url: "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Frango", url: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { nome: "Muda", url: "https://images.unsplash.com/photo-1649255717215-cbc24b661bbb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

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
      imagem: p.imagem,
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
      imagem: form.imagem.trim(),
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
            <div className="h-40 bg-accent/40 flex items-center justify-center overflow-hidden">
              {p.imagem ? (
                <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover" />
              ) : (
                <Camera className="size-12 text-muted-foreground" aria-hidden />
              )}
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
          <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl border border-border max-h-[calc(100dvh-3rem)] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">
                {editing ? "Editar produto" : "Adicionar produto"}
              </h2>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-muted" aria-label="Fechar">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={save} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                <Field label="Galeria de imagens">
                  <div className="grid grid-cols-5 gap-2">
                    {galeriaImagens.map((g) => {
                      const selecionada = form.imagem === g.url;
                      return (
                        <button
                          type="button"
                          key={g.url}
                          onClick={() => setForm({ ...form, imagem: g.url })}
                          title={g.nome}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selecionada
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-border hover:border-primary/60"
                          }`}
                        >
                          <img src={g.url} alt={g.nome} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Enviar imagem do dispositivo">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setForm((f) => ({ ...f, imagem: reader.result as string }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-sm text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Ou cole uma URL no campo abaixo.
                  </p>
                </Field>
                <Field label="URL da Imagem (opcional)">
                  <input
                    type="url"
                    value={form.imagem.startsWith("data:") ? "" : form.imagem}
                    onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                    className="input"
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                  <div className="mt-3 w-24 h-24 rounded-lg bg-accent/40 flex items-center justify-center overflow-hidden border border-border">
                    {form.imagem ? (
                      <img src={form.imagem} alt="Pré-visualização" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="size-8 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                </Field>
              </div>

              <div className="flex gap-3 p-6 pt-0 border-t border-border">
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
