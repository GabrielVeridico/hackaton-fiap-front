# hackaton-fiap-front — Conexão Solidária (Web)

Front-end da plataforma **Conexão Solidária** (Hackathon FIAP PosTech). É um **Next.js 16 (App Router)** com um **BFF (Backend-for-Frontend)** server-side: o navegador conversa apenas com o BFF, na mesma origem, e o BFF é quem chama os microsserviços. O JWT fica em cookies `httpOnly` — nenhum token chega ao JavaScript da página.

> **Ecossistema (6 repositórios):** `front` (este) · `users` · `donations` · `payments` · `notifications` · `orchestration`. Mapa completo no [orchestration](https://github.com/GabrielVeridico/hackaton-fiap-orchestration#ecossistema).

## Stack

| Item | Escolha |
|------|---------|
| Framework | Next.js 16.2.9 (App Router) / React 19 / TypeScript 5 |
| Estilo | Tailwind v4 · shadcn/ui na variante **Base UI** (`@base-ui/react`, não Radix) |
| Dados | TanStack Query no cliente; Server Components onde não há interação |
| Validação | Zod (formulários e variáveis de ambiente) + React Hook Form |
| Arquitetura | Camadas `domain` → `application` → `infrastructure`, com o App Router na borda |
| Testes | Vitest + Testing Library |
| Runtime | Node 22 (build e imagem Docker) |

O BFF resolve dois problemas de uma vez: elimina CORS (mesma origem) e tira o token do alcance do browser. Nenhuma variável `NEXT_PUBLIC_*` existe no projeto — toda configuração é server-side.

## Papel no fluxo

```
browser  →  /api/bff/*  (rota de rota do Next, mesma origem)
              ↓  injeta Authorization: Bearer a partir do cookie cs_at
           upstream: APIM (produção) ou os serviços diretos (desenvolvimento)
```

- **Sessão.** O login grava `cs_at` (access, ~4 h) e `cs_rt` (refresh, 7 dias) como cookies `httpOnly`.
- **Refresh automático.** `runAuthenticated` reexecuta a chamada uma vez após um 401, renovando o par de tokens antes de desistir.
- **Gate de navegação.** O proxy do Next protege `/perfil`, `/minhas-doacoes`, `/doar` e `/admin`, redirecionando para `/login` quando não há `cs_rt`. O gate olha o refresh, não o access: um access expirado não deve derrubar o usuário para a tela de login.
- **Dois modos de upstream.** `services` chama os três microsserviços diretamente (desenvolvimento); `apim` chama o gateway único (produção).

## Endpoints

### Rotas de página

| Rota | Acesso | Conteúdo |
|------|--------|----------|
| `/` | público | Página inicial |
| `/campanhas` | público | Campanhas abertas para doação |
| `/transparencia` | público | Painel de transparência (meta, arrecadado e percentual por campanha) |
| `/login` · `/cadastro` | público | Autenticação e autocadastro de doador |
| `/doar/{id}` | doador | Formulário de doação para uma campanha |
| `/minhas-doacoes` · `/minhas-doacoes/{id}` | doador | Histórico e status das próprias doações |
| `/perfil` | autenticado | Dados da conta |
| `/admin` | gestor | Painel de gestão |
| `/admin/campanhas`, `/nova`, `/{id}` | gestor | CRUD de campanhas |
| `/admin/usuarios`, `/novo`, `/{id}` | gestor | CRUD de usuários |

### Rotas do BFF (`/api/bff`)

| Método | Rota | Upstream |
|--------|------|----------|
| POST | `/api/bff/auth/login` · `/auth/register` · `/auth/logout` | UserAPI |
| GET | `/api/bff/auth/me` | UserAPI |
| GET · POST | `/api/bff/users` | UserAPI |
| PUT | `/api/bff/users/{id}` | UserAPI |
| PATCH | `/api/bff/users/{id}/role` · `/deactivate` · `/reactivate` | UserAPI |
| GET · POST | `/api/bff/campaigns` | DonationAPI |
| GET · PUT | `/api/bff/campaigns/{id}` | DonationAPI |
| PATCH | `/api/bff/campaigns/{id}/status` | DonationAPI |
| GET · POST | `/api/bff/donations` | DonationAPI |
| GET | `/api/bff/donations/{id}` | DonationAPI |
| GET | `/api/bff/transparency/campaigns` | DonationAPI (público) |

## Como rodar localmente

Pré-requisito: **Node 22**.

```bash
npm ci

# Opção A — sem backend: transparência e doações servidas por fixtures
UPSTREAM_MODE=services MOCK_DONOR_CAMPAIGNS=true MOCK_DONATIONS=true npm run dev

# Opção B — contra os serviços locais (users :5001, payments :5002, donations :5003)
npm run dev
```

A aplicação sobe em `http://localhost:3000`. Autenticação e gestão exigem os serviços reais no ar: os mocks cobrem apenas leitura de campanhas e doações.

Para subir a plataforma inteira de uma vez, use [orchestration/local](https://github.com/GabrielVeridico/hackaton-fiap-orchestration/tree/master/local).

### Docker

```bash
docker build -t hackatonfiap-front:local -f Dockerfile .
docker run -p 3000:3000 \
  -e UPSTREAM_MODE=apim \
  -e APIM_BASE_URL=https://<apim-host>.azure-api.net \
  hackatonfiap-front:local
```

A imagem expõe a porta **3000**.

## Configuração

Todas as variáveis são lidas no servidor e validadas por Zod no boot (`src/infrastructure/config/env.ts`). Ver `.env.example`.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `UPSTREAM_MODE` | não | `services` (padrão, chama os três serviços) ou `apim` (gateway único) |
| `APIM_BASE_URL` | quando `UPSTREAM_MODE=apim` | Raiz do gateway, **sem** `/api`. Ex.: `https://<apim-host>.azure-api.net` |
| `USERS_API_URL` | não | Padrão `http://localhost:5001`. Usada só no modo `services` |
| `DONATIONS_API_URL` | não | Padrão `http://localhost:5003`. Usada só no modo `services` |
| `PAYMENTS_API_URL` | não | Padrão `http://localhost:5002`. Usada só no modo `services` |
| `MOCK_DONOR_CAMPAIGNS` | não | `true` serve as campanhas do doador por fixture. Padrão `false` |
| `MOCK_MY_DONATIONS` | não | `true` serve o histórico de doações por fixture. Padrão `false` |
| `MOCK_DONATIONS` | não | `true` serve a criação de doação por fixture. Padrão `false` |

Para descobrir o host do APIM do ambiente:

```bash
az apim list -g hackaton-fiap --query "[].gatewayUrl" -o tsv
```

## Testes

```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest
```

São **119 casos** em 35 arquivos, distribuídos pelas camadas: regras de domínio, use cases, mappers, gateways HTTP, cliente de upstream, sessão em cookie, validação de ambiente e os formulários de login, cadastro, doação, campanha e usuário. A CI roda exatamente estes três comandos.

## CI/CD

`.github/workflows/ci-cd.yml`. A cada push ou pull request na `main`, e sob `workflow_dispatch`:

- **Job `ci`** — `npm ci`, `lint`, `typecheck`, `vitest` e `docker build`. Roda sempre, sem depender de nenhum segredo.
- **Job `cd`** — condicionado a `vars.DEPLOY_TO_ACA == 'true'`. Sem essa variável o pipeline fecha verde só com a CI.

O deploy faz login federado por **OIDC**, envia a imagem ao **ACR** e atualiza o Container App com `az containerapp update`.

A aplicação roda em **Azure Container Apps** (`ca-conexao-front`, no resource group `hackaton-fiap`), com `UPSTREAM_MODE=apim` e `APIM_BASE_URL` apontando para o gateway. O provisionamento está em `orchestration/iac/frontend.bicep` e o passo a passo em `orchestration/iac/deploy-frontend.ps1`.

## Estrutura de pastas

```
src/
├── domain/          # Result/DomainError, entidades (auth, campaigns, donations, transparency, users)
├── application/     # ports (gateways e sessão), use cases, mappers, runAuthenticated
├── infrastructure/  # server-only: config (Zod), upstream-client, gateways HTTP e mock,
│                    #   cookie-session-store (cs_at/cs_rt), composition.ts
├── app/             # App Router: páginas e o BFF em app/api/bff/**/route.ts
├── components/      # UI (shadcn/Base UI) e componentes de domínio
├── hooks/ · lib/    # bff-client, http-status, rótulos, formatação em BRL
└── proxy.ts         # gate de sessão nas rotas privadas
```

A dependência aponta para dentro: `app` e `components` só falam com `application`, que só conhece `domain` e as próprias portas. As implementações concretas vivem em `infrastructure` e são amarradas em `composition.ts`.

## Convenção de UI

Este projeto usa a variante **Base UI** do shadcn/ui, não Radix. Consequência prática: o `Button` não tem `asChild`. Para renderizar um botão como link, use `render` com `nativeButton={false}`:

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

<Button render={<Link href="/transparencia" />} nativeButton={false}>
  Transparência
</Button>
```

O `nativeButton={false}` garante que o `<a>` gerado seja anunciado como link, e não como `role="button"`, por leitores de tela.
