# Template — LP + Filtro de Leads + Tracking + Mini CRM

Template base do produto (Dácora): landing page especializada + modal de qualificação
de leads + tracking avançado (Meta CAPI + Google Enhanced Conversions) + mini CRM
administrativo em `/admin`. Pensado pra ser clonado por cliente (1 deploy Vercel + 1
Supabase próprio por cliente, isolamento total — não é app multi-tenant).

**Origem**: código-base copiado do repo de produção
[`lp---karyne-magalhaes`](https://github.com/flacora-projetos/lp---karyne-magalhaes)
em 2026-07-23 (commit `3ebd130`, snapshot via `git archive`, sem o histórico de commits
dela — repo novo, história limpa). O repo da Karyne continua intocado como cliente
piloto; este aqui é a base pra virar template de verdade.

## Status: Fase 1 (parametrização) concluída — ainda precisa de conteúdo/funil por cliente

O conteúdo visível (marca, textos, fotos, funil comercial) ainda é o específico da
Dra. Karyne Magalhães (halitose/Goiânia) — isso é esperado, é edição manual por cliente
(ver `docs/CUSTOMIZAR-POR-CLIENTE.md`). O que a Fase 1 resolveu:

- **Virou env var (sem fallback pra credencial de cliente)**: `META_PIXEL_ID`
  (`lib/metaCapi.ts` + `src/utils/env.ts`), `GA4_MEASUREMENT_ID` e
  `GTM_CONTAINER_ID` (`index.html`, injetados em build/dev via plugin Vite),
  `WHATSAPP_NUMBER` (`src/components/QualificationModal.tsx`). Ver `.env.example`.
  Se uma dessas ficar vazia, o recurso correspondente simplesmente não inicializa
  (sem erro) — útil pra cliente novo ainda sem uma das contas configurada.
- **Feature flags adicionadas**: `ENABLE_META_CAPI` e `ENABLE_GOOGLE_EC`
  (`lib/metaCapi.ts` / `lib/googleEc.ts`). Default = comportamento de sempre
  (dispara se as credenciais estiverem configuradas); setar como `"false"`
  desliga o envio DE PROPÓSITO e deixa isso explícito no log, distinguindo de
  um esquecimento de configuração.
- **Documentado, não generalizado (decisão deliberada)**: funil do Kanban
  (`src/admin/types.ts` + `api/leads.ts` `STATUS_VALIDOS`) e o disparo de
  fechamento de loop de conversões (`api/leads.ts` `dispatchConsultaRealizada`)
  continuam específicos da Karyne — view completo de o que revisar/editar ao
  clonar pra um cliente novo em **`docs/CUSTOMIZAR-POR-CLIENTE.md`**.
- **Fora de escopo desta fase, ainda hardcoded**: marca/textos/cores/copy da LP
  (edição de conteúdo manual por cliente, sem sistema de templating — também
  documentado em `docs/CUSTOMIZAR-POR-CLIENTE.md`), domínio (responsabilidade do
  deploy/DNS por cliente, não é código), URL do Google Apps Script em
  `QualificationModal.tsx` (planilha de backup da Karyne, não avaliado nesta fase).

Ver memória do projeto `produto-lp-multicliente` (sessão Claude) e
`docs/handoff-fechar-loop-conversoes.md` /
`docs/handoff-validar-loop-conversoes.md` no repo da Karyne pra contexto completo de
como o tracking foi construído e validado.

## Rodar localmente

```bash
npm install
npm run dev
```

Precisa de um `.env.local` com as credenciais do Supabase (ver `.env.example`) — sem
service account do Google/Meta configurada, os disparos de tracking falham
silenciosamente (fire-and-forget), não quebra o app.
