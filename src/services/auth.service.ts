import { storeConfig } from '../config/store.config'

// ATENÇÃO: esta é uma trava de acesso SIMPLES, pensada para impedir que
// alguém entre no painel administrativo por acaso (ex: achou a URL).
// NÃO é segurança de verdade: a senha fica visível no código enviado ao
// navegador, e uma pessoa com conhecimento técnico consegue burlar isso.
// A autenticação real será implementada na migração para Supabase.

const CHAVE_SESSAO = `${storeConfig.storagePrefix}/admin-autenticado`

export const auth = {
  // Confere a senha digitada. Se estiver correta, marca a sessão do
  // navegador (aba atual) como autenticada e retorna true.
  autenticar(senhaDigitada: string): boolean {
    if (senhaDigitada === storeConfig.adminSenha) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(CHAVE_SESSAO, 'true')
      }
      return true
    }
    return false
  },

  // Verifica se a sessão atual já foi autenticada.
  estaAutenticado(): boolean {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(CHAVE_SESSAO) === 'true'
  },

  // Encerra a sessão (logout).
  sair(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CHAVE_SESSAO)
    }
  },
}