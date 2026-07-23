# Customizar por cliente — o que editar ao clonar este template

Este documento existe porque **nem tudo neste template é configurável via env
var**. Duas categorias de coisa ficam de fora de propósito (decisão tomada na
Fase 1 de parametrização, 2026-07) e exigem edição manual de código a cada
cliente novo. Ler isto ANTES de clonar pra um cliente é o objetivo.

## 1. Funil comercial (Kanban) e o status que fecha o loop de conversões

O funil hoje é o da Dra. Karyne Magalhães (clínica de halitose): 7 etapas
específicas desse nicho (`contato_realizado`, `negociando_consulta`,
`desistiu_consulta`, `consulta_agendada`, `consulta_realizada`,
`estorno_cancelada`, `outros_invalido`). Isso **não generaliza** pra outros
nichos — ex.: um cliente B2B/agro (ciclo de venda mais longo, sem "consulta")
precisa de etapas completamente diferentes.

**Decisão do produto**: não construir um sistema de funil configurável (baixo
volume de clientes não justifica essa engenharia). O funil é adaptado
manualmente no código do clone, arquivo por arquivo, listados abaixo.

### Arquivos a revisar/editar

1. **`src/admin/types.ts`**
   - `StatusComercial` — o union type com os nomes de status válidos.
   - `STATUS_ORDER` — ordem das etapas (usada em seletor e filtro).
   - `STATUS_LABEL` — rótulo exibido de cada status.
   - `STATUS_STYLE` — cor do badge de cada status.
   - `KANBAN_COLUMNS` — as colunas do quadro Kanban (label, status, accent).
     Hoje é mapa 1:1 status↔coluna; pode juntar mais de um status por coluna
     se fizer sentido pro funil novo (o campo `members` já suporta isso).

2. **`api/leads.ts`**
   - `STATUS_VALIDOS` — whitelist server-side dos mesmos nomes de status de
     `StatusComercial`. **Precisa ficar em sincronia com `types.ts`** — se
     esquecer de atualizar aqui, o PATCH do Kanban rejeita o novo status.

3. **`api/leads.ts` → `dispatchConsultaRealizada`** (dentro de `handlePatch`)
   - Hoje dispara quando `status_comercial` muda **para** `'consulta_realizada'`
     — esse é o status-gatilho do "fechamento de loop" de conversões (envia
     evento `ConsultaRealizada` pro Meta CAPI e Google Enhanced Conversions,
     sinalizando "isso virou negócio de verdade" pros dois canais de mídia).
   - Ao trocar o funil, decida **qual novo status representa a mesma coisa**
     (o momento em que o lead vira cliente/negócio fechado de verdade) e:
     - Troque a condição `update.status_comercial === 'consulta_realizada'`
       (aparece duas vezes em `handlePatch`) para o novo status-gatilho.
     - Considere trocar o nome do evento `'ConsultaRealizada'` (hardcoded em
       `dispatchConsultaRealizada`) para algo genérico ou específico do
       cliente (ex.: `'VendaFechada'`, `'PedidoConfirmado'`) — e **espelhar
       esse mesmo nome na configuração da conversão customizada dentro do
       Meta Ads Manager** do cliente novo, senão o evento chega mas não conta
       como conversão configurada.
   - A env var `GOOGLE_ADS_CONVERSION_ACTION_ID_QUALIFICADO` também é
     específica desse fechamento de loop — cada cliente tem sua própria ação
     de conversão no Google Ads, criada e mapeada manualmente (não tem como
     descobrir isso automaticamente).

**Não pule a revisão do item 3.** Um clone que troca o funil mas esquece de
adaptar `dispatchConsultaRealizada` continua rodando com a lógica antiga —
ela não quebra (o status antigo simplesmente nunca é atingido no funil novo),
mas o fechamento de loop de conversões fica **silenciosamente morto** pro
cliente novo, sem nenhum erro visível.

## 2. Marca, textos e cores da LP

Todo o conteúdo visível da landing page é código React direto em
`src/components/*.tsx` e `index.html` (meta tags, JSON-LD/schema.org,
conteúdo `<noscript>` pra crawlers): nome do profissional/empresa, copy de
cada seção, FAQ, preços, endereço, redes sociais, fotos, paleta de cores
(tokens Tailwind embutidos nas classes, não CSS vars centralizadas).

**Decisão do produto**: isso não é parametrizável via env var nesta fase —
é edição de conteúdo mesmo, feita manualmente por cliente. Não existe (e não
foi construído) nenhum sistema de templating de copy. Ao clonar:

- Reescreva o conteúdo de cada componente em `src/components/` pro novo
  cliente/nicho.
- Atualize `index.html`: `<title>`, meta description/OG/Twitter, os três
  blocos `application/ld+json` (schema.org), e o conteúdo `<noscript>`.
- Revise **todos** os números de WhatsApp que aparecem como copy (não só o
  `WHATSAPP_NUMBER` de env var) — ex.: `src/components/Footer.tsx` e
  `src/components/PrivacyPolicy.tsx` hoje têm números da Karyne escritos
  direto no texto, fora do fluxo de qualificação de leads.

## O que É parametrizável via env var (não precisa editar código)

Ver `.env.example` para a lista completa. Resumo: Supabase (URL/keys),
`META_PIXEL_ID` + `META_ACCESS_TOKEN` (+ `ENABLE_META_CAPI`),
`GA4_MEASUREMENT_ID`, `GTM_CONTAINER_ID`, credenciais do Google Ads Data
Manager (+ `ENABLE_GOOGLE_EC`), `WHATSAPP_NUMBER` (o número do fluxo de
qualificação), `ADMIN_EMAILS`.
