# Gerenciador de Tarefas

API REST para gerenciamento de tarefas em equipe, construída com Node.js, TypeScript, Express e Prisma (PostgreSQL). Permite criar usuários, autenticar, organizar times, atribuir tarefas a membros e acompanhar o histórico de mudanças de status.

🔗 **Deploy:** [https://gerenciadortarefas.onrender.com](https://gerenciadortarefas.onrender.com)

> ⚠️ O deploy está no plano gratuito do Render. Se o serviço estiver inativo por um tempo, a primeira requisição pode demorar de 30 a 50+ segundos para "acordar" a instância.

---

## Tecnologias

- **Node.js** + **TypeScript**
- **Express** — servidor HTTP
- **Prisma ORM** + **PostgreSQL**
- **Zod** — validação de dados
- **JWT** (`jsonwebtoken`) — autenticação
- **bcrypt** — hash de senhas
- **Jest** + **Supertest** — testes automatizados
- **tsx** — execução em desenvolvimento
- **tsup** — build para produção

---

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js `>= 20.19.0`
- PostgreSQL (local ou remoto)
- npm

### 1. Clonar o repositório
```bash
git clone https://github.com/ChrisRufino/GerenciadorTarefas.git
cd GerenciadorTarefas
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com base no `.env-example`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="uma_string_secreta_qualquer"
PORT=3333
```

### 4. Rodar as migrations do Prisma
```bash
npx prisma migrate dev
```

### 5. Gerar o Prisma Client
```bash
npx prisma generate
```

### 6. Iniciar o servidor em modo desenvolvimento
```bash
npm run dev
```

O servidor vai subir em `http://localhost:3333` (ou na porta definida em `PORT`).

### 7. (Opcional) Build para produção
```bash
npm run build
npm run start
```

---

## Como rodar os testes

Os testes usam **Jest** + **Supertest** e rodam contra o banco definido em `.env.test`.

### 1. Criar o arquivo `.env.test` na raiz do projeto
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco_de_teste"
JWT_SECRET="test-secret-key"
PORT=3333
```

> Recomendado usar um banco separado do de desenvolvimento, para evitar que os testes apaguem ou sobrescrevam dados reais.

### 2. Aplicar as migrations nesse banco de teste
```bash
npx dotenv -e .env.test -- npx prisma migrate deploy
```

### 3. Rodar a suíte de testes
```bash
npm run test:dev
```

Esse comando roda o Jest em modo watch (`--watchAll --runInBand`), reexecutando os testes conforme os arquivos são alterados.

**O que os testes cobrem:**
- `users-controller.test.ts` — criação de usuário e validação de e-mail duplicado
- `team-controller.test.ts` — criação de time (com autenticação e autorização de administrador)
- `sessions-controller.test.ts` / `tasks-controller.test.ts` — reservados para testes futuros

---

## Documentação dos Endpoints

**Base URL (local):** `http://localhost:3333`
**Base URL (produção):** `https://gerenciadortarefas.onrender.com`

A maioria das rotas exige autenticação via **JWT**, enviado no header:
```
Authorization: Bearer <token>
```

Alguns endpoints também exigem que o usuário autenticado tenha a role `administrator` ou `member`, conforme indicado em cada rota.

### 👤 Usuários

#### Criar usuário
```
POST /users
```
**Autenticação:** não requer

**Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "123456"
}
```

**Respostas:**
- `201` — usuário criado, retorna o usuário (sem a senha)
- `409` — e-mail já está em uso
- `400` — erro de validação (nome com menos de 3 caracteres, e-mail inválido, senha com menos de 6 caracteres)

---

### 🔑 Sessões (Login)

#### Autenticar usuário
```
POST /sessions
```
**Autenticação:** não requer

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

**Respostas:**
- `200` — retorna `{ token, user }`
- `401` — e-mail ou senha inválidos

---

### 🏢 Times (Teams)

Todas as rotas abaixo exigem autenticação **e** role `administrator`.

#### Criar time
```
POST /teams
```
**Body:**
```json
{
  "name": "Nome do Time",
  "description": "Descrição do time"
}
```
**Respostas:** `201` criado · `409` nome já em uso

#### Listar times
```
GET /teams
```
Retorna todos os times com as tarefas e usuários vinculados.

#### Atualizar nome do time
```
PATCH /teams/:id/name
```
**Body:**
```json
{ "name": "Novo Nome do Time" }
```

#### Deletar time
```
DELETE /teams/:id
```
**Resposta:** `204`

---

### 👥 Membros de Time

#### Adicionar membro a um time
```
POST /members
```
**Autenticação:** requer role `administrator`

**Body:**
```json
{
  "userId": 1,
  "teamId": 1
}
```
**Resposta:** `201`

#### Remover membro de um time
```
DELETE /members/:id
```
**Autenticação:** requer role `administrator`

**Resposta:** `204`

#### Listar membros
```
GET /membersList
```
**Autenticação:** requer role `administrator` ou `member`

Retorna todos os vínculos de usuário/time.

---

### ✅ Tarefas (Tasks)

Todas as rotas abaixo exigem autenticação.

#### Criar tarefa
```
POST /tasks
```
**Autenticação:** requer role `administrator`

**Body:**
```json
{
  "user_id": 1,
  "team_id": 1,
  "title": "Título da tarefa",
  "description": "Descrição da tarefa",
  "priority": "high"
}
```
`priority` aceita: `"high"` | `"low"` | `"average"`

**Resposta:** `201`

#### Listar tarefas
```
GET /tasks
```
**Autenticação:** requer role `administrator` ou `member`

**Query params (opcionais):**
- `status`: `pending` | `making` | `completed`
- `priority`: `high` | `low` | `average`

> Usuários com role `member` só visualizam as tarefas atribuídas a eles mesmos. Administradores visualizam todas.

#### Atribuir tarefa a um usuário
```
PATCH /tasks/:id/assign
```
**Autenticação:** requer role `administrator`

**Body:**
```json
{ "user_id": 2 }
```

#### Atualizar status da tarefa
```
PATCH /tasks/:id/status
```
**Autenticação:** requer role `administrator`

**Body:**
```json
{ "status": "making" }
```
`status` aceita: `pending` | `making` | `completed`

> Toda mudança de status é registrada automaticamente no histórico de tarefas.

#### Deletar tarefa
```
DELETE /tasks/:id
```
**Autenticação:** requer role `administrator`

**Resposta:** `204`

---

### 🕓 Histórico de Tarefas

#### Listar histórico de alterações
```
GET /tasks-history
```
**Autenticação:** requer usuário autenticado

**Query params (opcionais):**
- `taskId`: número — filtra o histórico de uma tarefa específica

Retorna o histórico ordenado do mais recente para o mais antigo, incluindo quem realizou cada alteração.

---

## Estrutura de erros

Todas as respostas de erro seguem o formato:
```json
{ "message": "Descrição do erro" }
```

Erros de validação (Zod) retornam adicionalmente o campo `issues`:
```json
{
  "message": "Validations Error",
  "issues": { ... }
}
```

| Código | Significado |
|---|---|
| `400` | Erro de validação ou requisição malformada |
| `401` | Não autenticado / token inválido ou ausente |
| `403`/`401` | Sem permissão para o recurso (role incorreta) |
| `404` | Recurso não encontrado |
| `409` | Conflito (ex: e-mail ou nome já em uso) |
| `500` | Erro interno do servidor |
