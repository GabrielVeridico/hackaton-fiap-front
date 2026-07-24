# hackaton-fiap-front (Conexão Solidária — Web)

Front-end da plataforma **Conexão Solidária** (Hackathon FIAP PosTech): **Next.js 16 (App Router)** com um **BFF (Backend-for-Frontend)** server-side. O navegador fala **apenas com o BFF** (mesma origem → sem CORS); o BFF chama o backend (via **APIM** em produção) e guarda o JWT em **cookies httpOnly** — nenhum token chega ao JavaScript do browser.

- **Next.js 16.2.9 / React 19 / TypeScript** · **Tailwind v4** · **shadcn/ui (Base UI)** · **TanStack Query** · **Zod** · **React Hook Form**
- **Arquitetura limpa em camadas** dentro do `src/`
- **Vitest** (106 casos: domínio, use cases, gateways, BFF, componentes)
- **Node 22** (ver `Dockerfile`)

> **Hospedado no Azure:** roda em **Azure Container Apps** (`ca-conexao-front`). Provisionamento em `hackaton-fiap-orchestration/iac/frontend.bicep`.

## Arquitetura

```
src/
├── domain/          # Result/DomainError, entidades (auth, campaigns, donations, transparency), regras puras
├── application/     # ports (gateways/session), use cases, mappers, runAuthenticated (refresh-on-401)
├── infrastructure/  # server-only: config/env (Zod), http/upstream-client, gateways HTTP/mock,
│                    #   session/cookie-session-store (cs_at/cs_rt), composition.ts
├── app/             # App Router: páginas (RSC/client) + BFF em app/api/bff/**/route.ts
├── components/ · hooks/ · lib/ (bff-client, http-status, format BRL)
```

**Fluxo:** `browser → /api/bff/* (BFF, mesma origem) → upstream (APIM ou serviços) → resposta`. O login seta `cs_at`/`cs_rt` (httpOnly); rotas autenticadas leem o `cs_at` e injetam `Authorization: Bearer` no upstream, com refresh automático em 401.

## Variáveis de ambiente (runtime)

| Var | Descrição |
|-----|-----------|
| `UPSTREAM_MODE` | `services` (dev, 3 serviços) ou `apim` (produção, gateway único) |
| `APIM_BASE_URL` | **obrigatória quando `UPSTREAM_MODE=apim`** — RAIZ do gateway, **sem `/api`** (ex.: `https://apim-conexao-solidaria-7xafxr.azure-api.net`) |
| `USERS_API_URL` / `DONATIONS_API_URL` / `PAYMENTS_API_URL` | usadas só no modo `services` (defaults `http://localhost:5001/5003/5002`) |
| `MOCK_DONOR_CAMPAIGNS` / `MOCK_MY_DONATIONS` / `MOCK_DONATIONS` | fixtures para rodar sem backend (default `false`) |

Não há `NEXT_PUBLIC_*` — tudo é server-side. Ver `.env.example`.

## Como rodar localmente

```bash
npm ci

# Opção A — sem backend (fixtures): transparência e doações mockadas
UPSTREAM_MODE=services MOCK_DONOR_CAMPAIGNS=true MOCK_DONATIONS=true npm run dev

# Opção B — contra os serviços locais (users :5001, donations :5003, payments :5002)
npm run dev
```
App em `http://localhost:3000`. Auth/gestão exigem os serviços reais no ar (sem mock).

Qualidade (o que a CI roda):
```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest
```

### Docker
```bash
docker build -t hackatonfiap-front:local -f Dockerfile .
docker run -p 3000:3000 -e UPSTREAM_MODE=apim -e APIM_BASE_URL=https://<apim>.azure-api.net hackatonfiap-front:local
```

## Deploy (Azure Container Apps)
Imagem publicada no ACR e implantada em `ca-conexao-front` (RG `hackaton-fiap`). Provisionamento e passo a passo em `hackaton-fiap-orchestration/iac/frontend.bicep` + `deploy-frontend.ps1`. Env de produção: `UPSTREAM_MODE=apim` + `APIM_BASE_URL=<gateway APIM>`.

## CI/CD
`.github/workflows/ci-cd.yml`: push/PR na `main` → `npm ci` + `lint` + `typecheck` + `vitest` + **build da imagem Docker** (sempre). Deploy no Container App **opcional/gated** por `vars.DEPLOY_TO_ACA == 'true'`.

## Convenções de UI

Este projeto usa a variante **Base UI** do shadcn/ui (`@base-ui/react`), não Radix. Portanto o `Button` **não** tem `asChild`. Para renderizar um botão como link (`<Link>` do Next), use `render` + `nativeButton={false}`:

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

<Button render={<Link href="/transparencia" />} nativeButton={false}>
  Transparência
</Button>
```

`nativeButton={false}` garante que o `<a>` renderizado seja anunciado como link (não `role="button"`) por leitores de tela.
