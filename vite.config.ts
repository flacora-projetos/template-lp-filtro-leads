import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

export default defineConfig(({mode}) => {
  // Lê de process.env (Vercel, em build/produção) com fallback para
  // .env.local (dev). Mesmo padrão pra toda config específica de cliente
  // deste clone do template — nunca hardcoded no código.
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const pick = (key: string) => process.env[key] || fileEnv[key] || '';

  // Config PÚBLICA do Supabase (URL + anon key) injetada no bundle do /admin.
  // A anon key é pública por design (protegida por RLS). A service_role NUNCA
  // é exposta aqui.
  const SUPABASE_URL = pick('SUPABASE_URL');
  const SUPABASE_ANON_KEY = pick('SUPABASE_ANON_KEY');

  // IDs de tracking e o WhatsApp de destino: não são segredo (já ficam
  // visíveis no HTML/JS do navegador), mas são específicos de cada cliente
  // deste template — por isso vêm de env var em vez de hardcoded no código.
  // Ver .env.example e docs/CUSTOMIZAR-POR-CLIENTE.md.
  const META_PIXEL_ID = pick('META_PIXEL_ID');
  const GA4_MEASUREMENT_ID = pick('GA4_MEASUREMENT_ID');
  const GTM_CONTAINER_ID = pick('GTM_CONTAINER_ID');
  const WHATSAPP_NUMBER = pick('WHATSAPP_NUMBER');

  // index.html precisa desses IDs em scripts inline no <head> (GA4/GTM/Meta
  // Pixel carregam antes do bundle React) — substituição de placeholder em
  // build/dev, já que Vite `define` só atua sobre JS/TS, não sobre o HTML cru.
  const htmlEnvPlugin: Plugin = {
    name: 'html-env-placeholders',
    transformIndexHtml(html) {
      return html
        .replaceAll('__META_PIXEL_ID__', META_PIXEL_ID)
        .replaceAll('__GA4_MEASUREMENT_ID__', GA4_MEASUREMENT_ID)
        .replaceAll('__GTM_CONTAINER_ID__', GTM_CONTAINER_ID);
    },
  };

  return {
    define: {
      __SUPABASE_URL__: JSON.stringify(SUPABASE_URL),
      __SUPABASE_ANON_KEY__: JSON.stringify(SUPABASE_ANON_KEY),
      __META_PIXEL_ID__: JSON.stringify(META_PIXEL_ID),
      __WHATSAPP_NUMBER__: JSON.stringify(WHATSAPP_NUMBER),
    },
    plugins: [react(), tailwindcss(), htmlEnvPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
