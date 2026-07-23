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

## Status: baseline, NÃO é template genérico ainda

Isto ainda é o código específico da Dra. Karyne Magalhães (halitose/Goiânia). Falta a
parametrização (Fase 1 do roadmap) antes de servir pra outro cliente:

- **Hardcoded → precisa virar env var**: `META_PIXEL_ID` (fallback em
  `src/utils/metaPixel.ts` + `lib/metaCapi.ts`), GA4 `G-3783BP5DSB` e GTM
  `GTM-P32CM7H7` (`index.html`), WhatsApp `5562999320675`
  (`src/components/QualificationModal.tsx`), marca/textos/cores, domínio.
  `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY` já são env.
- **Feature flags a adicionar**: Meta CAPI e Google Enhanced Conversions deveriam ser
  opcionais por cliente (nem todo cliente tem Google Ads/Meta Ads configurado dia 1) —
  hoje disparam incondicionalmente se as env vars existirem.
- **Funil do Kanban é clínico** (`contato_realizado`, `consulta_agendada`,
  `consulta_realizada` etc., em `src/admin/types.ts` + `api/leads.ts` `STATUS_VALIDOS`)
  — não serve 1:1 pra outros nichos (ex.: B2B/agro). Decidir se genericiza ou se vira
  parte do processo de clonagem por cliente.
- **Conteúdo/copy da LP** (`index.html`, componentes em `src/components/`) é 100%
  específico da Karyne (halitose, CRO-GO, fotos dela) — precisa ser trocado por
  cliente, não é parametrizável via env var, é edição de conteúdo mesmo.
- **Fechamento de loop de conversões** (`api/leads.ts` `handlePatch` →
  `dispatchConsultaRealizada`) está atrelado ao status `consulta_realizada` e à env var
  `GOOGLE_ADS_CONVERSION_ACTION_ID_QUALIFICADO` — depende do funil clínico acima, revisar
  junto.

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
