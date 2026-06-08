/* Morphix — Supabase client singleton (PKCE, session persistence) */

(function () {
  let client = null;

  function getConfig() {
    return window.MORPHIX_CONFIG || {};
  }

  function isConfigured() {
    const cfg = getConfig();
    return Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
  }

  function getRedirectBase() {
    const cfg = getConfig();
    return (cfg.authRedirectBase || window.location.origin).replace(/\/$/, '');
  }

  function getCallbackUrl() {
    return getRedirectBase() + '/auth/callback.html';
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (client) return client;

    const cfg = getConfig();
    client = supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
        storage: window.localStorage,
      },
    });
    return client;
  }

  window.MorphixSupabase = {
    isConfigured,
    getClient,
    getCallbackUrl,
    getRedirectBase,
  };
})();
