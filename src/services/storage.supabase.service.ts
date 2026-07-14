import { supabase } from './supabaseConexao'

// Versão do serviço de armazenamento que fala com o Supabase (banco na nuvem)
// em vez do localStorage. As funções têm os mesmos nomes (get/set/remove)
// do storage.service.ts original, mas agora são assíncronas (retornam uma
// Promise), porque toda operação de banco precisa esperar uma resposta da
// internet.
//
// Isso só é usado pelas páginas que já foram migradas explicitamente para
// o Supabase. Páginas ainda não migradas continuam usando storage.service.ts
// (localStorage) sem nenhum problema, até serem migradas uma a uma.

// --- Conversão de nomes: banco usa snake_case, o app usa camelCase ---

function servicoDoBancoParaApp(row: any) {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    preco: row.preco,
    duracao: row.duracao,
    imagem: row.imagem,
    categoria: row.categoria,
    diasSemana: row.dias_semana || [],
    horarios: row.horarios || [],
  }
}

function servicoDoAppParaBanco(servico: any) {
  return {
    id: servico.id,
    nome: servico.nome,
    descricao: servico.descricao,
    preco: servico.preco,
    duracao: servico.duracao,
    imagem: servico.imagem,
    categoria: servico.categoria,
    dias_semana: servico.diasSemana || [],
    horarios: servico.horarios || [],
  }
}

function agendamentoDoBancoParaApp(row: any) {
  return {
    id: row.id,
    servicoId: row.servico_id,
    data: row.data,
    horario: row.horario,
    clienteNome: row.cliente_nome,
    clienteTelefone: row.cliente_telefone,
    status: row.status,
    canceladoPorExclusaoDeServico: row.cancelado_por_exclusao_de_servico || false,
  }
}

function agendamentoDoAppParaBanco(agendamento: any) {
  return {
    id: agendamento.id,
    servico_id: agendamento.servicoId,
    data: agendamento.data,
    horario: agendamento.horario,
    cliente_nome: agendamento.clienteNome,
    cliente_telefone: agendamento.clienteTelefone,
    status: agendamento.status,
    cancelado_por_exclusao_de_servico: agendamento.canceladoPorExclusaoDeServico || false,
  }
}

// --- Serviço principal ---

export const storageSupabase = {
  // Busca todos os registros de "servicos" ou "agendamentos".
  // Mantém a mesma "forma" do storage.service.ts local: get(nome, fallback).
  async get(nome: 'servicos' | 'agendamentos', fallback: any[]): Promise<any[]> {
    const { data, error } = await supabase.from(nome).select('*')

    if (error) {
      console.error(`Erro ao buscar "${nome}" no Supabase:`, error)
      return fallback
    }

    if (!data) return fallback

    return nome === 'servicos'
      ? data.map(servicoDoBancoParaApp)
      : data.map(agendamentoDoBancoParaApp)
  },

  // Sincroniza a tabela inteira para bater com a lista completa fornecida
  // (mesma lógica que o app já usa: sempre salva a lista inteira atualizada).
  // Isso: 1) insere/atualiza (upsert) todos os itens da lista;
  //       2) remove do banco qualquer item que não esteja mais na lista.
  async set(nome: 'servicos' | 'agendamentos', lista: any[]): Promise<void> {
    const linhas =
      nome === 'servicos'
        ? lista.map(servicoDoAppParaBanco)
        : lista.map(agendamentoDoAppParaBanco)

    if (linhas.length > 0) {
      const { error: erroUpsert } = await supabase.from(nome).upsert(linhas)
      if (erroUpsert) {
        console.error(`Erro ao salvar "${nome}" no Supabase:`, erroUpsert)
        return
      }
    }

    const idsAtuais = lista.map(item => item.id)
    if (idsAtuais.length > 0) {
      const { error: erroDelete } = await supabase
        .from(nome)
        .delete()
        .not('id', 'in', `(${idsAtuais.map(id => `"${id}"`).join(',')})`)
      if (erroDelete) {
        console.error(`Erro ao remover itens antigos de "${nome}" no Supabase:`, erroDelete)
      }
    } else {
      // Lista vazia = remover tudo da tabela.
      const { error: erroDeleteTudo } = await supabase.from(nome).delete().neq('id', '')
      if (erroDeleteTudo) {
        console.error(`Erro ao limpar "${nome}" no Supabase:`, erroDeleteTudo)
      }
    }
  },

  // Remove todos os registros da tabela informada.
  async remove(nome: 'servicos' | 'agendamentos'): Promise<void> {
    const { error } = await supabase.from(nome).delete().neq('id', '')
    if (error) {
      console.error(`Erro ao remover todos os registros de "${nome}" no Supabase:`, error)
    }
  },
}