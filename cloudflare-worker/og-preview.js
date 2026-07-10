// Worker de Cloudflare: inyecta metaetiquetas Open Graph (titulo, imagen,
// descripcion) por taller/masterclass para que WhatsApp, Facebook, Twitter,
// etc. muestren la vista previa correcta al compartir un link.
//
// El sitio (fuchsia-web) es estatico (GitHub Pages) y una sola pagina sirve
// a todos los talleres via ?slug=, cambiando el contenido con JS despues de
// cargar. Los crawlers de redes sociales NO ejecutan JS, solo leen el HTML
// crudo, por eso siempre veian el <title>/imagen generico del archivo.
//
// Este worker deja pasar todo el trafico normal sin tocarlo, y SOLO para
// crawlers conocidos en /talleres/ o /empowerd/masterclass/ con ?slug=,
// reescribe el <head> de la respuesta con los datos reales de Supabase antes
// de devolverla.
//
// Rutas a configurar en Cloudflare (Workers Routes, dentro de la zona
// fuchsia.com.co):
//   fuchsia.com.co/talleres/*
//   fuchsia.com.co/empowerd/masterclass/*
// Requisito: el registro DNS de fuchsia.com.co debe estar "Proxied" (nube
// naranja), no "DNS only", para que las Workers Routes apliquen.

const SUPABASE_URL = 'https://unwbfjkjcuslbnesbgjd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5Ndcroab51xZrNzEQE8EqA__0BOBKMd';

const BOT_UA = /whatsapp|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|pinterest|redditbot|snapchat|skypeuripreview|embedly|quora link preview|vkshare|iframely|whatsup|bot\/|preview/i;

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ua = request.headers.get('User-Agent') || '';

    const esTaller = url.pathname.startsWith('/talleres');
    const esMasterclass = url.pathname.startsWith('/empowerd/masterclass');
    const slug = url.searchParams.get('slug');

    if (!BOT_UA.test(ua) || (!esTaller && !esMasterclass) || !slug) {
      return fetch(request);
    }

    const tabla = esTaller ? 'talleres' : 'masterclasses';
    const campoDescripcion = esTaller ? 'descripcion' : null;

    const apiUrl = `${SUPABASE_URL}/rest/v1/${tabla}?slug=eq.${encodeURIComponent(slug)}&select=titulo,imagen_url${campoDescripcion ? ',' + campoDescripcion : ''}`;
    const [origenResp, supaResp] = await Promise.all([
      fetch(request),
      fetch(apiUrl, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }),
    ]);

    if (!supaResp.ok) return origenResp;
    const filas = await supaResp.json();
    const item = filas[0];
    if (!item) return origenResp;

    const titulo = `${item.titulo} — Fuchsia`;
    const descripcion = (item.descripcion || 'Talleres y masterclasses de Fuchsia.').slice(0, 200);
    const imagen = item.imagen_url || 'https://fuchsia.com.co/assets/img/fuchsia-logo-oficial.png';
    const paginaUrl = url.toString();

    return new HTMLRewriter()
      .on('title', {
        element(el) { el.setInnerContent(titulo); },
      })
      .on('head', {
        element(el) {
          el.append(
            `<meta property="og:title" content="${escapeHtml(titulo)}">
             <meta property="og:description" content="${escapeHtml(descripcion)}">
             <meta property="og:image" content="${escapeHtml(imagen)}">
             <meta property="og:url" content="${escapeHtml(paginaUrl)}">
             <meta property="og:type" content="website">
             <meta name="twitter:card" content="summary_large_image">
             <meta name="twitter:title" content="${escapeHtml(titulo)}">
             <meta name="twitter:description" content="${escapeHtml(descripcion)}">
             <meta name="twitter:image" content="${escapeHtml(imagen)}">`,
            { html: true }
          );
        },
      })
      .transform(origenResp);
  },
};
