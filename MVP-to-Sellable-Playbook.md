\# De MVP a Sistema Vendável — Roteiro Completo



Este documento registra tudo que foi feito no projeto \*\*Estética Showcase\*\* (clínica) para transformar um MVP gerado no Lovable em um sistema pronto para vender a clientes reais. Serve como \*\*playbook reutilizável\*\* para os próximos projetos (Pet Mania e futuros).



\---



\## PARTE 1 — O que foi feito (registro histórico)



\### Fase 0: Diagnóstico e correção de bugs de build



O projeto estava com tela branca havia dias. Causas encontradas, em ordem:



1\. \*\*`index.html` indevido na raiz.\*\* Esse template (TanStack Start) gera o HTML sozinho a partir do `root.tsx` — um `index.html` manual não deveria existir e conflitava com isso.

2\. \*\*Faltava o plugin do Tailwind\*\* (`@tailwindcss/vite`) no `vite.config.ts` — sem ele, nenhuma classe de estilo era processada (página aparecia sem cor/layout).

3\. \*\*CSS nunca importado\*\* — faltava `import '../styles.css'` no `\_\_root.tsx`.

4\. \*\*Pasta `public` vazia\*\* — faltava o ícone do site (favicon), causando erro 404 no console (cosmético, mas visível).



\*\*Lição para outros MVPs:\*\* ao herdar um projeto com tela branca, verificar nessa ordem: (1) arquivo de entrada HTML correto para o framework em uso, (2) plugins de build essenciais configurados, (3) CSS importado, (4) console do navegador para erros 404/JS.



\### Fase 1: Bugs de navegação e regras de negócio



\- Link de "voltar" faltando entre páginas do catálogo.

\- Calendário de agendamento não liberava dias de semana corretamente — causa: `date-fns` gera nomes de dia como `"segunda-feira"`, mas o cadastro salvava `"Segunda"`; a comparação de texto nunca batia. Corrigido com uma função de normalização (remove acento, caixa baixa, remove sufixo `-feira`).

\- Painel só mostrava contagens numéricas, sem lista real de agendamentos — criada a página `/agendamentos` com filtros (Todos/Hoje/Futuros) e ações de cancelar/remover.



\*\*Lição:\*\* ao integrar bibliotecas de data/calendário com dados salvos como texto livre, sempre normalizar ambos os lados antes de comparar (acentos, maiúsculas, sufixos linguísticos).



\### Fase 2: Centralização de configuração



Criado `src/config/store.config.ts` — um único arquivo com nome do negócio, descrição, prefixo de armazenamento, WhatsApp, cores e (depois) senha do admin. Todas as páginas passaram a importar daqui em vez de ter valores fixos espalhados.



\*\*Por que isso vem cedo no processo:\*\* é o que permite, no futuro, clonar o projeto para um cliente novo trocando \*\*um arquivo só\*\*, em vez de caçar valores em cada página.



\### Fase 3: Abstração de armazenamento



Criado `src/services/storage.service.ts` com funções genéricas `get`/`set`/`remove`, escondendo os detalhes de `localStorage` por trás de uma interface simples. Todas as páginas passaram a usar esse serviço em vez de chamar `localStorage` diretamente.



\*\*Por que:\*\* prepara o terreno para trocar a tecnologia de persistência (localStorage → banco de dados real) sem precisar reescrever a lógica de cada página — só o "motor" por dentro do serviço muda.



\### Fase 4: Regras de negócio finas



\- \*\*Auto-cancelamento de agendamentos órfãos:\*\* ao excluir um serviço, os agendamentos vinculados são automaticamente marcados como cancelados (não apagados — preserva histórico), em vez de ficarem "presos" a um serviço inexistente.

\- \*\*Limpeza retroativa:\*\* botão manual para cancelar agendamentos órfãos criados antes dessa correção existir.

\- \*\*Tratamento de imagem quebrada:\*\* URLs de imagem que falham ao carregar mostram um placeholder ("Imagem indisponível") em vez do ícone quebrado do navegador.



\*\*Lição:\*\* toda relação entre duas entidades (serviço ↔ agendamento) precisa de uma regra explícita para o caso de uma das pontas ser excluída. Decidir isso cedo evita dados "zumbis" no sistema.



\### Fase 5: Proteção de acesso (interina)



Criado um sistema de senha simples (`auth.service.ts` + componente `RequireAuth.tsx`) protegendo as páginas administrativas (`/`, `/servicos`, `/agendamentos`), usando `sessionStorage` (expira ao fechar a aba).



\*\*Limitação reconhecida e documentada:\*\* isso não é autenticação real — a senha fica visível no código enviado ao navegador. Serve só para impedir acesso casual, até a migração para autenticação real de um banco de dados.



\*\*Decisão consciente:\*\* não adiantar a estrutura de autenticação real do Supabase antes de haver um cliente de verdade — o risco de construir algo genérico e errado (sem saber os requisitos reais de uso) supera o ganho de "adiantar trabalho".



\### Fase 6: Decisão arquitetural — unitário vs. multi-tenant



Decidido (e replicado do projeto do Pet Mania): \*\*um projeto/banco por cliente\*\*, não uma base compartilhada multi-tenant. Motivos:

\- Poucos clientes no momento — multi-tenant resolve um problema que ainda não existe.

\- Isolamento de dados mais simples e mais seguro de implementar sem exigir RLS complexo.

\- Facilita venda ("seus dados ficam no seu próprio banco").

\- Revisitar essa decisão só quando houver \~5+ clientes pagantes e a manutenção manual começar a doer.



\### Fase 7: Migração de localStorage para Supabase



1\. Criado projeto Supabase, tabelas `servicos` e `agendamentos` (schema espelhando os campos do localStorage, em `snake\_case`).

2\. RLS habilitado + políticas de acesso público temporárias (aceitável só enquanto não há autenticação real de usuário) + `grant` explícito de permissões (passo frequentemente esquecido: RLS e `GRANT` são camadas diferentes).

3\. Variáveis de ambiente (`.env`, nunca commitado) com URL e chave pública do Supabase.

4\. Criado `storage.supabase.service.ts`, com a mesma "forma" (`get`/`set`) do serviço antigo, mas assíncrono — mantendo o \*\*serviço antigo intacto\*\* durante a transição, migrando as páginas \*\*uma de cada vez\*\* (não é uma troca de arquivo único, como se imaginava inicialmente — todo consumidor precisa virar assíncrono).

5\. \*\*Armadilha encontrada:\*\* nomear um arquivo com `.client.` no meio (ex: `supabase.client.ts`) aciona uma proteção automática do TanStack Start que bloqueia esse arquivo de ser importado por código de servidor (SSR) — mesmo sendo só uma conexão de banco. Corrigido renomeando o arquivo.

6\. Otimização de performance: eliminada uma busca redundante após cada gravação (usar os dados que acabaram de ser salvos para atualizar a tela, em vez de buscar tudo de novo — 3 idas e voltas viraram 2).



\*\*Lição mais importante desta fase:\*\* ao planejar migração de armazenamento síncrono → banco assíncrono, \*\*avisar antecipadamente\*\* que isso não é "troca de um arquivo", e sim mudança que se propaga por todo consumidor daquele serviço.



\### Fase 8: Ajustes finos e polimento



\- Horários de atendimento passaram a ser ordenados cronologicamente ao cadastrar (antes ficavam na ordem do clique).

\- Corrigido cálculo de "hoje" que usava `toISOString()` (UTC) em vez da data local — causava contagem errada perto da virada do dia, dependendo do fuso horário do usuário.

\- Links do dashboard passaram a abrir a página de agendamentos já no filtro certo (usando parâmetros de busca da URL do roteador).

\- Filtro "Futuros" ajustado para não sobrepor com "Hoje" (estritamente depois de hoje, não "hoje em diante").

\- Removidos resíduos visuais e de código do template original (componentes mortos com nome/textos de outro projeto, nunca importados por nenhuma rota).

\- Ícone do site (favicon) criado e aplicado de forma consistente em todos os cabeçalhos.

\- Campo de telefone restrito a aceitar apenas números.



\*\*Lição:\*\* esses detalhes só aparecem com uso real e teste ponta a ponta — reservar uma rodada dedicada de "revisão fina" antes de qualquer demonstração a cliente.



\### Fase 9: Documentação



Criado `SETUP\_GUIDE.md` na raiz do projeto — passo a passo completo para clonar o sistema para um cliente novo (repositório, projeto Supabase, SQL das tabelas, variáveis de ambiente, deploy, checklist de testes).



\---



\## PARTE 2 — Roteiro genérico para aplicar em outros MVPs



Esta é a versão \*\*generalizada\*\* do processo acima, para aplicar a qualquer MVP (Pet Mania, e os futuros), independente do nicho de negócio.



\### Etapa 1 — Diagnóstico e estabilização

\- \[ ] Site carrega sem tela branca / erro de build?

\- \[ ] Console do navegador sem erros 404 ou JS?

\- \[ ] Fluxo principal do negócio funciona de ponta a ponta pelo menos uma vez?



\### Etapa 2 — Centralização de configuração

\- \[ ] Criar `store.config.ts` (ou equivalente): nome, descrição, contato, prefixo de dados, cores.

\- \[ ] Nenhum texto de marca "hardcoded" deve sobrar espalhado pelo código depois desta etapa.



\### Etapa 3 — Abstração de armazenamento

\- \[ ] Criar uma camada única de acesso a dados (`storage.service.ts` ou nome equivalente).

\- \[ ] Todas as páginas devem passar a usar essa camada, nunca `localStorage` direto.



\### Etapa 4 — Regras de negócio críticas

\- \[ ] Mapear toda relação entre entidades (ex: produto ↔ pedido, serviço ↔ agendamento) e decidir explicitamente o que acontece quando uma ponta é excluída.

\- \[ ] Tratar falhas de carregamento de imagens/mídia externas.

\- \[ ] Qualquer outra regra específica do negócio que, se ignorada, gera dados inconsistentes.



\### Etapa 5 — Proteção de acesso interina

\- \[ ] Adicionar trava de senha simples nas áreas administrativas, mesmo sabendo que não é segurança definitiva.

\- \[ ] Documentar claramente a limitação, para não passar confiança falsa.



\### Etapa 6 — Decisão: unitário vs. multi-tenant

\- \[ ] Por padrão: um banco por cliente, até haver evidência real de que múltiplos clientes justificam multi-tenant.



\### Etapa 7 — Migração para banco de dados real

\- \[ ] Criar projeto de banco (Supabase ou equivalente) — um por cliente, quando for produção.

\- \[ ] Desenhar schema espelhando os dados existentes.

\- \[ ] Configurar RLS \*\*e\*\* permissões (`GRANT`) — são camadas diferentes, as duas são necessárias.

\- \[ ] Variáveis de ambiente, nunca commitadas.

\- \[ ] Migrar consumidores \*\*um de cada vez\*\*, sabendo que a mudança de síncrono→assíncrono se propaga.

\- \[ ] Atenção a convenções reservadas do framework em uso (ex: nomes de arquivo especiais).

\- \[ ] Revisar performance (evitar buscas redundantes após gravações).



\### Etapa 8 — Polimento fino

\- \[ ] Ordenação de listas (cronológica, alfabética — o que fizer sentido).

\- \[ ] Cálculos de data/hora usando fuso horário local, nunca UTC cru, quando o negócio é local.

\- \[ ] Navegação entre páginas preservando contexto (filtros, estado).

\- \[ ] Remoção de resíduos visuais/código de templates anteriores.

\- \[ ] Favicon e identidade visual consistente.

\- \[ ] Validação de campos de entrada (telefone só números, e-mail com formato, etc.).



\### Etapa 9 — Documentação

\- \[ ] Criar `SETUP\_GUIDE.md` com o passo a passo de clonagem para cliente novo.



\### Etapa 10 — Teste de ponta a ponta

\- \[ ] Testar no ambiente publicado (não só local), como gestor \*\*e\*\* como cliente final.

\- \[ ] Varredura visual completa procurando resíduos de outros projetos.



\---



\## PARTE 3 — Checklist pós-venda (quando um cliente comprar)



Quando você me procurar de novo após uma venda, isto é o que vamos revisar/mudar juntos:



\- \[ ] \*\*Banco de dados:\*\* criar projeto Supabase novo e exclusivo do cliente (nunca reaproveitar o de teste).

\- \[ ] \*\*`store.config.ts`:\*\* nome do negócio, descrição, WhatsApp, cores, senha do admin.

\- \[ ] \*\*`.env`:\*\* credenciais do banco novo, local e no Vercel.

\- \[ ] \*\*Identidade visual:\*\* cores (se o cliente tiver uma paleta própria), fontes (se solicitado), fotos/imagens reais do negócio do cliente substituindo qualquer imagem de exemplo.

\- \[ ] \*\*Domínio:\*\* configurar domínio próprio do cliente (ou subdomínio), apontando DNS para o Vercel.

\- \[ ] \*\*Textos:\*\* revisão geral de qualquer texto ainda genérico ou de exemplo.

\- \[ ] \*\*Melhorias não solicitadas, mas que valem a pena\*\* sempre revisar nessa hora: performance percebida (plano gratuito vs. pago), qualquer bug conhecido pendente da lista de pendências do projeto-base, e itens de segurança que ficaram como "provisório" (ex: senha simples) — avaliar se já é hora de resolver definitivamente.

\- \[ ] \*\*Teste de ponta a ponta\*\* completo no ambiente final do cliente antes da entrega.



\---



\*Documento vivo — atualizar conforme novos aprendizados surgirem em cada novo projeto.\*

