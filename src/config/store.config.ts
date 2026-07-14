// Configuração central deste app.
// Ao clonar este projeto para um novo cliente, o objetivo é que
// SÓ ESTE ARQUIVO precise ser alterado (nome, WhatsApp, cores, prefixo de dados).

export const storeConfig = {
  // Nome exibido no dashboard, no título da aba do navegador e em outros textos.
  nome: 'Clínica Showcase',

  // Descrição usada na meta tag <description> (aparece em buscadores/links compartilhados).
  descricao: 'Agende seus serviços de estética com facilidade.',

  // Prefixo usado em todas as chaves salvas no localStorage.
  // Ex: `${storagePrefix}/servicos`, `${storagePrefix}/agendamentos`.
  // IMPORTANTE: mudar este valor em um cliente já em uso apaga o acesso aos dados antigos
  // (eles ficam salvos sob o prefixo antigo). Só mudar em um cliente novo, do zero.
  storagePrefix: '@clinic',

  // Número de WhatsApp que recebe a mensagem de confirmação de agendamento.
  // Formato: código do país + DDD + número, sem espaços, traços ou parênteses.
  // Exemplo Brasil: 55 (país) + 11 (DDD) + número.
  whatsappNumero: '5511999999999',

  // Cores principais usadas nos botões, ícones e destaques.
  // Precisam ser nomes de cor válidos do Tailwind (ex: pink, blue, green, purple, orange).
  cores: {
    primaria: 'pink',   // cor de destaque principal (títulos, botões principais)
    secundaria: 'blue', // cor usada em botões/ícones secundários
    destaque: 'green',  // cor usada em indicadores de sucesso/confirmação
  },

  // Senha de acesso ao painel administrativo (/servicos e /agendamentos).
  // ATENÇÃO: isso é apenas uma trava simples contra acesso casual, NÃO é
  // segurança de verdade — o valor fica visível no código enviado ao navegador.
  // A autenticação real (com hash de senha e validação no servidor) será
  // implementada na migração para Supabase.
  adminSenha: 'clinica2026',
}