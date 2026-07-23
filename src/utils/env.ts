// Constantes de configuração específicas do cliente deste clone do template,
// injetadas em build time pelo Vite (`define`, ver vite.config.ts). Nenhuma
// delas é segredo (pixel/GA/GTM IDs e o WhatsApp de destino já ficam visíveis
// no HTML/JS do navegador), mas todas vêm de env var em vez de hardcoded —
// ver .env.example e docs/CUSTOMIZAR-POR-CLIENTE.md.
declare const __META_PIXEL_ID__: string;
declare const __WHATSAPP_NUMBER__: string;

export const META_PIXEL_ID = __META_PIXEL_ID__;
export const WHATSAPP_NUMBER = __WHATSAPP_NUMBER__;
