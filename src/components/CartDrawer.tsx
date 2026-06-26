import { useState, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1595859703065-cc958019e07b?w=400&q=80";

export function CartDrawer({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  const { cart, removeFromCart, updateCartQty, checkoutCart } = useStore();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ cliente: "", whatsapp: "", observacao: "" });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const totalItens = cart.reduce((a, c) => a + c.quantidade, 0);
  const totalValor = cart.reduce((a, c) => a + c.preco * c.quantidade, 0);

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault();

    const pedido = checkoutCart({
      cliente: form.cliente,
      whatsapp: form.whatsapp,
      observacao: form.observacao,
    });

    if (pedido) {
      setSuccess(true);

      let numeroWhatsApp = '';
      try {
        const fazenda = JSON.parse(localStorage.getItem('@mr/fazenda') || '{}');
        numeroWhatsApp = fazenda.whatsapp || '67999222720';
      } catch {
        numeroWhatsApp = '67999222720';
      }
      numeroWhatsApp = numeroWhatsApp.replace(/\D/g, '');

      // 🔥 MENSAGEM FORMATADA COM EMOJIS
      const itensTexto = pedido.itens
        ? pedido.itens.map((item) => `• ${item.quantidade}x ${item.produto}`).join('\n')
        : `• ${pedido.quantidade}x ${pedido.produto}`;

      const mensagem = `🌱 *NOVO PEDIDO*\n\n👤 Cliente: ${pedido.cliente}\n📞 Telefone: ${form.whatsapp || 'Não informado'}\n\n🛒 *ITENS:*\n${itensTexto}\n\n📝 Observações: ${form.observacao || 'Nenhuma'}\n\n💰 *TOTAL: R$ ${pedido.valor.toFixed(2)}*`;

      const url = `https://wa.me/55${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    }
  }

  function reset() {
    setOpen(false);
    setCheckout(false);
    setSuccess(false);
    setForm({ cliente: "", whatsapp: "", observacao: "" });
  }

  return (
    <>
      {/* SACOLA STICKY NO TOPO */}
      <div className="sticky top-[70px] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 h-11 rounded-full bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:opacity-95 transition-all font-semibold"
            aria-label="Abrir sacola"
          >
            <div className="relative">
              <ShoppingBag className="size-5" />
              {mounted && totalItens > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-5 flex items-center justify-center border-2 border-primary">
                  {totalItens}
                </span>
              )}
            </div>
            <span className="text-sm whitespace-nowrap">
              Sacola{mounted ? ` (${totalItens} ${totalItens === 1 ? "item" : "itens"})` : ""}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={reset} />
          <aside className="relative w-full max-w-md bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <header className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-primary" />
                <h2 className="text-lg font-bold">
                  {success ? "Pedido enviado" : checkout ? "Finalizar pedido" : "Sua sacola"}
                </h2>
              </div>
              <button onClick={reset} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
                <X className="size-5" />
              </button>
            </header>

            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="size-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pedido enviado!</h3>
                <p className="text-muted-foreground mb-8 max-w-xs">
                  Seu pedido foi enviado para a fazenda. O WhatsApp será aberto automaticamente para confirmar.
                </p>
                <button
                  onClick={reset}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90"
                >
                  Continuar comprando
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                <ShoppingBag className="size-12 mb-4 opacity-40" />
                <p>Sua sacola está vazia.</p>
                <p className="text-sm mt-1">Adicione produtos do catálogo.</p>
              </div>
            ) : checkout ? (
              <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="rounded-xl bg-accent/30 border border-border p-4 space-y-1.5 text-sm">
                    {cart.map((c) => (
                      <div key={c.id} className="flex justify-between">
                        <span className="text-muted-foreground">{c.quantidade}× {c.nome}</span>
                        <span className="font-medium">{formatBRL(c.preco * c.quantidade)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatBRL(totalValor)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Seu nome</label>
                    <input
                      required
                      value={form.cliente}
                      onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                      className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                      placeholder="Ex: Maria da Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">WhatsApp</label>
                    <input
                      required
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Observação (opcional)</label>
                    <textarea
                      value={form.observacao}
                      onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                      className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary resize-none h-20"
                      placeholder="Preferência de entrega, etc."
                    />
                  </div>
                </div>
                <footer className="border-t border-border p-5 flex gap-3 bg-card">
                  <button
                    type="button"
                    onClick={() => setCheckout(false)}
                    className="flex-1 border border-border rounded-xl py-3 font-semibold hover:bg-muted"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 font-bold hover:opacity-90"
                  >
                    Enviar pedido
                  </button>
                </footer>
              </form>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {cart.map((c) => (
                    <div key={c.id} className="flex gap-3 p-3 rounded-xl border border-border bg-background">
                      <img
                        src={c.imagem || FALLBACK_IMG}
                        alt={c.nome}
                        className="size-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{c.nome}</div>
                        <div className="text-xs text-muted-foreground">{formatBRL(c.preco)} / {c.unidade}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateCartQty(c.id, c.quantidade - 1)}
                            disabled={c.quantidade <= 1}
                            className="size-7 rounded-md border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{c.quantidade}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(c.id, c.quantidade + 1)}
                            disabled={c.quantidade >= c.estoque}
                            className="size-7 rounded-md border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40"
                          >
                            <Plus className="size-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(c.id)}
                            className="ml-auto p-1.5 text-muted-foreground hover:text-destructive"
                            aria-label="Remover"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary whitespace-nowrap">
                        {formatBRL(c.preco * c.quantidade)}
                      </div>
                    </div>
                  ))}
                </div>
                <footer className="border-t border-border p-5 bg-card">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatBRL(totalValor)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckout(true)}
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:opacity-90"
                  >
                    Finalizar pedido
                  </button>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
