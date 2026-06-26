// Cliente Supabase compartido (cargar despues del SDK de supabase-js y de config.js)
window.FUCHSIA_SB = supabase.createClient(window.FUCHSIA_SUPABASE_URL, window.FUCHSIA_SUPABASE_KEY);
