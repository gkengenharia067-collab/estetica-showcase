\# SETUP\_GUIDE — Como configurar este sistema para um novo cliente



Este guia documenta o passo a passo completo para clonar este projeto (atualmente configurado para uma clínica de estética) e colocá-lo no ar para um novo cliente, com banco de dados próprio e isolado.



\*\*Tempo estimado\*\*, seguindo este guia à risca: 30-60 minutos.



\---



\## 0. Pré-requisitos



\- Node.js e npm instalados

\- Conta no \[GitHub](https://github.com)

\- Conta no \[Vercel](https://vercel.com)

\- Conta no \[Supabase](https://supabase.com)

\- Git configurado no terminal



\---



\## 1. Clonar o repositório para o cliente novo



1\. No GitHub, abra o repositório deste projeto.

2\. Use a opção \*\*"Use this template"\*\* (ou faça um fork/clone manual) para criar um repositório novo, com nome identificando o cliente (ex: `clinica-nome-do-cliente`).

3\. Clone o repositório novo na sua máquina:

&#x20;  ```

&#x20;  git clone https://github.com/SEU\_USUARIO/nome-do-repositorio-novo.git

&#x20;  cd nome-do-repositorio-novo

&#x20;  npm install

&#x20;  ```



\---



\## 2. Criar um projeto Supabase novo (exclusivo deste cliente)



\*\*Importante:\*\* cada cliente deve ter seu próprio projeto Supabase, isolado dos demais. Nunca reaproveite o projeto de outro cliente.



1\. Acesse \[supabase.com](https://supabase.com) → \*\*New Project\*\*.

2\. Dê um nome identificando o cliente.

3\. Escolha a região mais próxima do público-alvo (ex: São Paulo, para clientes no Brasil).

4\. Defina uma senha de banco de dados forte e guarde em local seguro.

5\. Aguarde a criação do projeto (leva 1-2 minutos).



\### 2.1 Criar as tabelas



No menu lateral, vá em \*\*SQL Editor\*\* → \*\*New query\*\*, cole e rode:



```sql

\-- Tabela de serviços

create table servicos (

&#x20; id text primary key,

&#x20; nome text not null,

&#x20; descricao text,

&#x20; preco numeric not null,

&#x20; duracao integer not null,

&#x20; imagem text,

&#x20; categoria text,

&#x20; dias\_semana text\[] not null default '{}',

&#x20; horarios text\[] not null default '{}',

&#x20; criado\_em timestamptz not null default now()

);



\-- Tabela de agendamentos

create table agendamentos (

&#x20; id text primary key,

&#x20; servico\_id text not null references servicos(id) on delete set null,

&#x20; data date not null,

&#x20; horario text not null,

&#x20; cliente\_nome text not null,

&#x20; cliente\_telefone text not null,

&#x20; status text not null default 'confirmado',

&#x20; cancelado\_por\_exclusao\_de\_servico boolean default false,

&#x20; criado\_em timestamptz not null default now()

);

```



\### 2.2 Liberar acesso às tabelas (RLS + permissões)



Ainda no SQL Editor, rode:



```sql

\-- Habilita RLS

alter table servicos enable row level security;

alter table agendamentos enable row level security;



\-- Política de acesso público (adequado enquanto o sistema usa a senha

\-- simples de admin, sem autenticação real de usuário no Supabase)

create policy "Acesso publico total - servicos"

on servicos for all

using (true)

with check (true);



create policy "Acesso publico total - agendamentos"

on agendamentos for all

using (true)

with check (true);



\-- Permissões de leitura/escrita para os papéis usados pelo app

grant select, insert, update, delete on servicos to anon, authenticated;

grant select, insert, update, delete on agendamentos to anon, authenticated;

```



> ⚠️ Isso libera acesso público de leitura/escrita nas tabelas. É aceitável apenas enquanto não há autenticação real de usuário no Supabase (ver item 6). Não é uma configuração para um sistema com múltiplos clientes compartilhando o mesmo banco.



\### 2.3 Anotar as credenciais



No menu \*\*Settings → API\*\*, anote:

\- \*\*Project URL\*\*

\- \*\*anon / publishable key\*\* (a chave pública — nunca a `service\_role`/secret)



\---



\## 3. Configurar o arquivo `store.config.ts`



Edite `src/config/store.config.ts` com os dados do cliente novo:



```ts

export const storeConfig = {

&#x20; nome: 'Nome da Clínica do Cliente',

&#x20; descricao: 'Descrição curta do negócio.',

&#x20; storagePrefix: '@clinic', // pode manter, ou mudar se quiser (só em projeto novo)

&#x20; whatsappNumero: '55DDDNUMERODOCLIENTE', // sem espaços, traços ou parênteses

&#x20; cores: {

&#x20;   primaria: 'pink',

&#x20;   secundaria: 'blue',

&#x20;   destaque: 'green',

&#x20; },

&#x20; adminSenha: 'defina-uma-senha-forte-aqui',

}

```



\---



\## 4. Configurar o `.env` local



Na raiz do projeto, crie um arquivo `.env` (não vai para o GitHub — já está no `.gitignore`):



```

VITE\_SUPABASE\_URL=cole\_aqui\_a\_url\_do\_projeto\_supabase\_do\_cliente

VITE\_SUPABASE\_ANON\_KEY=cole\_aqui\_a\_chave\_anon\_publica\_do\_cliente

```



Rode `npm run dev` e teste localmente em `http://localhost:3000` antes de publicar.



\---



\## 5. Publicar no Vercel



1\. No \[Vercel](https://vercel.com), importe o repositório novo do GitHub.

2\. Antes do primeiro deploy (ou logo depois, em \*\*Settings → Environment Variables\*\*), adicione:

&#x20;  - `VITE\_SUPABASE\_URL` → mesmo valor do `.env`

&#x20;  - `VITE\_SUPABASE\_ANON\_KEY` → mesmo valor do `.env`

&#x20;  - Marque \*\*Production\*\*, \*\*Preview\*\* e \*\*Development\*\* para as duas

&#x20;  - Confirme que o toggle \*\*"Sensitive"\*\* está \*\*desativado\*\* nas duas (senão o ambiente Development é bloqueado)

3\. Faça o deploy (ou aguarde o deploy automático do próximo `git push`).



\---



\## 6. Checklist final antes de entregar ao cliente



\- \[ ] Login do painel admin (`/`, `/servicos`, `/agendamentos`) pede senha

\- \[ ] Senha configurada é a definida no passo 3 (não a de testes/demonstração)

\- \[ ] Cadastro de serviço funciona e aparece no Supabase (Table Editor)

\- \[ ] Catálogo público (`/catalogo`) mostra os serviços cadastrados

\- \[ ] Agendamento de teste funciona e abre o WhatsApp com o número correto do cliente

\- \[ ] Excluir um serviço cancela automaticamente os agendamentos vinculados

\- \[ ] Nome da clínica, cores e WhatsApp aparecem corretos em todas as telas

\- \[ ] Testado no site publicado do Vercel (não só localmente)

\- \[ ] Trocar a senha de demonstração por uma senha definitiva antes da entrega



\---



\## 7. Pendências conhecidas (não bloqueiam a entrega, mas vale considerar)



\- A autenticação do painel é uma senha simples (não é uma autenticação de usuário real com o Supabase). Suficiente para impedir acesso casual, mas não é segurança robusta.

\- Planos gratuitos (Vercel + Supabase) podem ter lentidão na primeira requisição do dia ("cold start"). Considerar upgrade de plano se isso incomodar o cliente.

\- Sem domínio próprio configurado por padrão — usa a URL padrão do Vercel (`nome-do-projeto.vercel.app`). Configurar domínio customizado é uma etapa separada, por cliente.

