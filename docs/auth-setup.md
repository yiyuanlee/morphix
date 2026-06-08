# Morphix Authentication Setup

Issue: [#5](https://github.com/yiyuanlee/morphix/issues/5)

Morphix uses **Supabase Auth** with:

- Email **magic link** (passwordless)
- **Google OAuth**
- PKCE flow + `/auth/callback.html` callback route

## 1. Client configuration

```bash
cp config.example.js config.js
```

Edit `config.js`:

```javascript
window.MORPHIX_CONFIG = {
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR_ANON_KEY',
};
```

For local Supabase:

```bash
supabase start
supabase status   # copy API URL and anon key
```

```javascript
window.MORPHIX_CONFIG = {
  supabaseUrl: 'http://127.0.0.1:54321',
  supabaseAnonKey: 'eyJ...',
};
```

`config.js` is gitignored. Never commit real keys.

## 2. Redirect URLs

Add these in **Supabase Dashboard → Authentication → URL Configuration**:

| Environment | Site URL | Redirect URLs |
|-------------|----------|---------------|
| Local | `http://127.0.0.1:8080` | `http://127.0.0.1:8080/auth/callback.html` |
| Local (alt) | `http://localhost:8080` | `http://localhost:8080/auth/callback.html` |
| GitHub Pages | `https://yiyuanlee.github.io/morphix` | `https://yiyuanlee.github.io/morphix/auth/callback.html` |
| Production | `https://your-domain.com` | `https://your-domain.com/auth/callback.html` |

Local `supabase/config.toml` mirrors these for `supabase start`.

## 3. Email magic link

1. Dashboard → **Authentication → Providers → Email** → Enable
2. For local dev, open **Inbucket** at `http://127.0.0.1:54324` to read magic link emails
3. User flow: enter email → click link in email → `/auth/callback.html` → redirect back to app

## 4. Google OAuth

### Google Cloud Console

1. Create OAuth 2.0 Client ID (Web application)
2. Authorized redirect URI (Supabase hosted callback):
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
3. Copy Client ID and Client Secret

### Supabase Dashboard

1. **Authentication → Providers → Google** → Enable
2. Paste Client ID and Secret
3. For local CLI, set env vars and enable in `supabase/config.toml`:

```bash
# .env.local (not committed)
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=...
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=...
```

Set `[auth.external.google] enabled = true` in `supabase/config.toml` for local testing.

## 5. Auth flow architecture

```
index.html
  ├─ config.js          (Supabase URL + anon key)
  ├─ supabase-client.js (PKCE client singleton)
  └─ auth.js            (sign-in UI, session refresh, logout)

auth/callback.html
  └─ exchangeCodeForSession(code) → redirect to morphix_auth_return path
```

### Session lifecycle

- **Page load:** `MorphixAuth.init()` → `getSession()` + `onAuthStateChange`
- **Auto refresh:** `autoRefreshToken: true` in supabase-client.js
- **Logout:** `signOut()` clears localStorage session + updates nav

## 6. Manual testing checklist

- [ ] Copy `config.example.js` → `config.js` with valid keys
- [ ] Nav shows **Log in** when logged out
- [ ] Magic link email arrives (Inbucket locally)
- [ ] Callback redirects to previous page with session active
- [ ] Nav shows masked email + **Log out**
- [ ] Refresh page — session persists
- [ ] Log out — session cleared, back to logged-out state
- [ ] Google sign-in redirects and returns with session (if configured)
- [ ] New user gets `profiles` row (trigger from migration #4)

## 7. Troubleshooting

| Problem | Fix |
|---------|-----|
| Auth nav hidden | `config.js` missing or empty keys |
| `redirect_uri_mismatch` | Add exact callback URL in Supabase + Google Console |
| Magic link goes to wrong host | Set `authRedirectBase` in config.js for GitHub Pages subdirectory |
| Session lost on refresh | Check browser localStorage not blocked; verify anon key |

## Related

- Schema: [database-schema.md](./database-schema.md)
- RLS: issue [#6](https://github.com/yiyuanlee/morphix/issues/6)
- Cloud sync UI: issue [#20](https://github.com/yiyuanlee/morphix/issues/20)
