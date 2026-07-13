import { storeConfig } from '../config/store.config'

// Este serviço é a ÚNICA parte do app que deveria "saber" que os dados
// hoje ficam salvos no localStorage do navegador.
//
// Toda a lógica de persistência fica isolada aqui. Quando o projeto migrar
// para um banco de dados de verdade (ex: Supabase), a ideia é trocar SÓ o
// conteúdo interno das funções abaixo — get/set/remove — mantendo a mesma
// "forma" (os mesmos nomes e parâmetros). Assim, nenhum outro arquivo do
// projeto (dashboard, serviços, catálogo, agendamentos) precisa ser alterado
// nessa futura migração.

function chaveCompleta(nome: string): string {
  return `${storeConfig.storagePrefix}/${nome}`
}

export const storage = {
  // Lê um valor salvo. Se não existir (ou o navegador não suportar
  // localStorage, como durante o SSR), devolve o "fallback" informado.
  get<T>(nome: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback
    try {
      const raw = localStorage.getItem(chaveCompleta(nome))
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch (erro) {
      console.error(`Erro ao ler "${nome}" do armazenamento:`, erro)
      return fallback
    }
  },

  // Salva um valor. Aceita qualquer dado serializável em JSON
  // (arrays, objetos, strings, números).
  set<T>(nome: string, valor: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(chaveCompleta(nome), JSON.stringify(valor))
    } catch (erro) {
      console.error(`Erro ao salvar "${nome}" no armazenamento:`, erro)
    }
  },

  // Remove um valor salvo.
  remove(nome: string): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(chaveCompleta(nome))
    } catch (erro) {
      console.error(`Erro ao remover "${nome}" do armazenamento:`, erro)
    }
  },
}