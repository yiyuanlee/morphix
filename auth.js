/* Morphix — Authentication (email magic link + Google OAuth) */

const AUTH_I18N = {
  zh: {
    login: '登录',
    logout: '退出',
    authTitle: '登录 Morphix',
    authSub: '登录后可云端同步你的健身计划（即将推出）',
    emailLabel: '邮箱',
    emailPlaceholder: 'your@email.com',
    magicLinkBtn: '发送登录链接',
    googleBtn: '使用 Google 登录',
    magicLinkSent: '登录链接已发送，请查收邮件',
    authError: '登录失败，请重试',
    authNotConfigured: '认证未配置',
    close: '关闭',
  },
  en: {
    login: 'Log in',
    logout: 'Log out',
    authTitle: 'Sign in to Morphix',
    authSub: 'Sign in to sync your fitness plans to the cloud (coming soon)',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    magicLinkBtn: 'Send magic link',
    googleBtn: 'Continue with Google',
    magicLinkSent: 'Check your email for the sign-in link',
    authError: 'Sign-in failed. Please try again.',
    authNotConfigured: 'Auth not configured',
    close: 'Close',
  },
};

function authT(key) {
  const lang = (typeof state !== 'undefined' && state.lang) ? state.lang : 'zh';
  return AUTH_I18N[lang][key] || AUTH_I18N.en[key] || key;
}

const MorphixAuth = (function () {
  let currentSession = null;
  let initialized = false;

  function getClient() {
    return window.MorphixSupabase && window.MorphixSupabase.getClient();
  }

  function isEnabled() {
    return window.MorphixSupabase && window.MorphixSupabase.isConfigured();
  }

  function getReturnPath() {
    const stored = sessionStorage.getItem('morphix_auth_return');
    if (stored) return stored;
    return window.location.pathname + window.location.search + window.location.hash;
  }

  function setReturnPath() {
    sessionStorage.setItem('morphix_auth_return', getReturnPath());
  }

  function clearReturnPath() {
    sessionStorage.removeItem('morphix_auth_return');
  }

  function formatEmail(email) {
    if (!email) return '';
    const at = email.indexOf('@');
    if (at < 3) return email;
    return email.slice(0, 2) + '***' + email.slice(at);
  }

  function updateNavUI(session) {
    const loginBtn = document.getElementById('authLoginBtn');
    const userMenu = document.getElementById('navUserMenu');
    const userEmail = document.getElementById('navUserEmail');
    const logoutBtn = document.getElementById('authLogoutBtn');
    const navAuth = document.getElementById('navAuth');

    if (!navAuth) return;

    if (!isEnabled()) {
      navAuth.style.display = 'none';
      return;
    }

    navAuth.style.display = 'flex';

    if (session && session.user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (userEmail) {
        userEmail.textContent = session.user.email
          ? formatEmail(session.user.email)
          : (session.user.user_metadata?.full_name || 'User');
      }
      if (logoutBtn) logoutBtn.textContent = authT('logout');
    } else {
      if (loginBtn) {
        loginBtn.style.display = 'inline-flex';
        loginBtn.textContent = authT('login');
      }
      if (userMenu) userMenu.style.display = 'none';
    }
  }

  function applyAuthModalCopy() {
    const map = {
      authModalTitle: 'authTitle',
      authModalSub: 'authSub',
      authEmailLabel: 'emailLabel',
      authMagicLinkBtn: 'magicLinkBtn',
      authGoogleBtnLabel: 'googleBtn',
      authModalClose: 'close',
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = authT(key);
    });
    const input = document.getElementById('authEmail');
    if (input) input.placeholder = authT('emailPlaceholder');
  }

  function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    if (!isEnabled()) {
      alert(authT('authNotConfigured'));
      return;
    }
    applyAuthModalCopy();
    const msg = document.getElementById('authMessage');
    if (msg) { msg.textContent = ''; msg.className = 'auth-message'; }
    const input = document.getElementById('authEmail');
    if (input) input.value = '';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (input) setTimeout(() => input.focus(), 100);
  }

  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showAuthMessage(text, type) {
    const msg = document.getElementById('authMessage');
    if (!msg) return;
    msg.textContent = text;
    msg.className = 'auth-message' + (type ? ' auth-message--' + type : '');
  }

  async function signInWithEmail(email) {
    const sb = getClient();
    if (!sb) throw new Error('not configured');
    setReturnPath();
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.MorphixSupabase.getCallbackUrl(),
      },
    });
    if (error) throw error;
  }

  async function signInWithGoogle() {
    const sb = getClient();
    if (!sb) throw new Error('not configured');
    setReturnPath();
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.MorphixSupabase.getCallbackUrl(),
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    const sb = getClient();
    if (!sb) return;
    const { error } = await sb.auth.signOut();
    if (error) console.error('signOut', error);
    currentSession = null;
    updateNavUI(null);
  }

  async function refreshSession() {
    const sb = getClient();
    if (!sb) return null;
    const { data, error } = await sb.auth.getSession();
    if (error) {
      console.error('getSession', error);
      return null;
    }
    currentSession = data.session;
    updateNavUI(currentSession);
    return currentSession;
  }

  async function init() {
    if (initialized) return currentSession;
    initialized = true;

    if (!isEnabled()) {
      updateNavUI(null);
      return null;
    }

    const sb = getClient();
    sb.auth.onAuthStateChange((_event, session) => {
      currentSession = session;
      updateNavUI(session);
    });

    await refreshSession();
    return currentSession;
  }

  function bindUI() {
    const loginBtn = document.getElementById('authLoginBtn');
    const logoutBtn = document.getElementById('authLogoutBtn');
    const closeBtn = document.getElementById('authModalClose');
    const backdrop = document.getElementById('authModalBackdrop');
    const magicBtn = document.getElementById('authMagicLinkBtn');
    const googleBtn = document.getElementById('authGoogleBtn');
    const form = document.getElementById('authForm');

    if (loginBtn) loginBtn.addEventListener('click', openAuthModal);
    if (logoutBtn) logoutBtn.addEventListener('click', () => signOut());
    if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
    if (backdrop) backdrop.addEventListener('click', closeAuthModal);

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail')?.value;
        if (!email) return;
        const btn = document.getElementById('authMagicLinkBtn');
        if (btn) btn.disabled = true;
        try {
          await signInWithEmail(email);
          showAuthMessage(authT('magicLinkSent'), 'success');
        } catch (err) {
          console.error(err);
          showAuthMessage(authT('authError'), 'error');
        } finally {
          if (btn) btn.disabled = false;
        }
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        googleBtn.disabled = true;
        try {
          await signInWithGoogle();
        } catch (err) {
          console.error(err);
          showAuthMessage(authT('authError'), 'error');
          googleBtn.disabled = false;
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAuthModal();
    });
  }

  return {
    init,
    bindUI,
    refreshSession,
    signOut,
    signInWithEmail,
    signInWithGoogle,
    openAuthModal,
    closeAuthModal,
    getSession: () => currentSession,
    isEnabled,
    onLanguageChange: applyAuthModalCopy,
  };
})();

window.MorphixAuth = MorphixAuth;

document.addEventListener('DOMContentLoaded', () => {
  MorphixAuth.bindUI();
  MorphixAuth.init();
});
