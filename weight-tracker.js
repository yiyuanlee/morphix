/* Morphix — Weight Tracker (Issue #14)
 *
 * Pro-tier feature: log daily weight and view a trend chart against the target.
 * Free users see a teaser with a "Pro" badge and upgrade prompt.
 *
 * Uses the `weight_logs` table created by supabase/migrations/20260606103000_phase1_schema.sql.
 * RLS is enabled in 20260606120000_phase1_rls_policies.sql, so reads/writes are scoped
 * to auth.uid() automatically.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------
  // i18n
  // ---------------------------------------------------------------
  const I18N = {
    zh: {
      sectionTag: '体重追踪',
      sectionTitle: '追踪体重，看见变化',
      sectionSub: '记录每日体重，绘制专属趋势线（Pro 专属）',

      proBadge: 'PRO',
      proTeaserTitle: '解锁体重趋势分析',
      proTeaserDesc: '升级到 Pro 即可记录每日体重、查看趋势图表与目标进度对比',
      upgradeBtn: '升级 Pro',
      learnMore: '了解更多',

      addTitle: '记录今天体重',
      dateLabel: '日期',
      weightLabel: '体重 (kg)',
      noteLabel: '备注（可选）',
      notePlaceholder: '运动后、晨起空腹…',
      addBtn: '记录',
      adding: '记录中…',
      addSuccess: '已记录 ✅',
      addError: '记录失败，请重试',

      chartTitle: '体重趋势',
      chartEmptyTitle: '开始记录你的体重',
      chartEmptyDesc: '记录第一条数据即可看到专属趋势图表',

      targetLabel: '目标',
      currentLabel: '当前',
      changeLabel: '较目标',
      noDataLabel: '暂无数据',
      avgLabel: '7 日均值',
      weeklyRateLabel: '周变化',
      weeksToGoalLabel: '预计达成',

      listTitle: '最近记录',
      listEmpty: '还没有记录',
      deleteBtn: '删除',
      deleteConfirm: '确认删除该条记录？',
      loadError: '加载失败，请刷新重试',

      entries: (n) => `${n} 条记录`,

      tooLow: '体重过低（< 30kg）',
      tooHigh: '体重过高（> 300kg）',
    },
    en: {
      sectionTag: 'Weight Tracker',
      sectionTitle: 'Track Your Weight, See Your Progress',
      sectionSub: 'Log your weight daily and visualize trends vs. your target (Pro)',

      proBadge: 'PRO',
      proTeaserTitle: 'Unlock weight trend analysis',
      proTeaserDesc: 'Upgrade to Pro to log daily weight, view trend charts and compare against your goal',
      upgradeBtn: 'Upgrade to Pro',
      learnMore: 'Learn more',

      addTitle: 'Log today\'s weight',
      dateLabel: 'Date',
      weightLabel: 'Weight (kg)',
      noteLabel: 'Note (optional)',
      notePlaceholder: 'Post-workout, morning fasted…',
      addBtn: 'Log',
      adding: 'Logging…',
      addSuccess: 'Logged ✅',
      addError: 'Failed to log, please retry',

      chartTitle: 'Weight Trend',
      chartEmptyTitle: 'Start logging your weight',
      chartEmptyDesc: 'Log your first entry to see your personal trend chart',

      targetLabel: 'Target',
      currentLabel: 'Current',
      changeLabel: 'vs Target',
      noDataLabel: 'No data',
      avgLabel: '7-day avg',
      weeklyRateLabel: 'Weekly rate',
      weeksToGoalLabel: 'Est. weeks to goal',

      listTitle: 'Recent entries',
      listEmpty: 'No entries yet',
      deleteBtn: 'Delete',
      deleteConfirm: 'Delete this entry?',
      loadError: 'Failed to load, please refresh',

      entries: (n) => `${n} ${n === 1 ? 'entry' : 'entries'}`,

      tooLow: 'Weight too low (< 30kg)',
      tooHigh: 'Weight too high (> 300kg)',
    },
  };

  function t(key, ...args) {
    // Read the global app state (defined in app.js as `let state = { lang, ... }`).
    // NOTE: do NOT name a local `state` variable — it would shadow the outer one
    // and silently force every i18n lookup to 'zh'.
    let lang = 'zh';
    if (typeof window !== 'undefined' && window.MorphixApp && window.MorphixApp.getLang) {
      lang = window.MorphixApp.getLang() || lang;
    } else if (typeof window !== 'undefined' && window.state && window.state.lang) {
      // Backward-compat: if a future refactor exposes state on window, pick it up.
      lang = window.state.lang;
    }
    const dict = I18N[lang] || I18N.zh;
    const v = dict[key];
    return typeof v === 'function' ? v(...args) : (v || key);
  }

  // ---------------------------------------------------------------
  // Module state
  // ---------------------------------------------------------------
  // Intentionally NOT named `state` — that would shadow the global
  // `let state = { lang, ... }` declared at the top of app.js.
  const moduleState = {
    entries: [],
    targetWeight: null,
    loading: false,
  };

  // ---------------------------------------------------------------
  // Supabase wrapper
  // ---------------------------------------------------------------
  function getClient() {
    return window.MorphixSupabase && window.MorphixSupabase.getClient();
  }
  function getSession() {
    return window.MorphixAuth && window.MorphixAuth.getSession
      ? window.MorphixAuth.getSession()
      : null;
  }

  async function loadEntries() {
    const sb = getClient();
    if (!sb) return { ok: false, reason: 'no-client' };
    const session = getSession();
    if (!session) return { ok: false, reason: 'no-auth' };

    const { data, error } = await sb
      .from('weight_logs')
      .select('id, weight_kg, logged_at, note, created_at')
      .order('logged_at', { ascending: false })
      .limit(60);

    if (error) {
      console.error('weight_logs load', error);
      return { ok: false, reason: 'db-error', error };
    }
    moduleState.entries = (data || []).map((row) => ({
      id: row.id,
      weight: parseFloat(row.weight_kg),
      date: row.logged_at, // YYYY-MM-DD
      note: row.note || '',
      createdAt: row.created_at,
    }));
    return { ok: true, count: moduleState.entries.length };
  }

  async function addEntry(weight, date, note) {
    const sb = getClient();
    if (!sb) return { ok: false, reason: 'no-client' };
    const session = getSession();
    if (!session) return { ok: false, reason: 'no-auth' };
    // Schema (phase1_schema.sql line 91): user_id is NOT NULL with no default
    // and no BEFORE INSERT trigger injects auth.uid(). RLS only *checks*
    // auth.uid() = user_id, it doesn't populate it. We must send it explicitly.
    const userId = session.user && session.user.id;
    if (!userId) return { ok: false, reason: 'no-user' };

    const payload = {
      user_id: userId,
      weight_kg: weight,
      logged_at: date,
    };
    if (note && note.trim()) payload.note = note.trim();

    const { data, error } = await sb
      .from('weight_logs')
      .upsert(payload, { onConflict: 'user_id,logged_at' })
      .select('id, weight_kg, logged_at, note, created_at')
      .single();

    if (error) {
      console.error('weight_logs upsert', error);
      return { ok: false, reason: 'db-error', error };
    }
    return { ok: true, entry: data };
  }

  async function deleteEntry(id) {
    const sb = getClient();
    if (!sb) return { ok: false, reason: 'no-client' };
    const session = getSession();
    if (!session) return { ok: false, reason: 'no-auth' };

    const { error } = await sb
      .from('weight_logs')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('weight_logs delete', error);
      return { ok: false, reason: 'db-error', error };
    }
    return { ok: true };
  }

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------
  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDate(iso) {
    if (!iso) return '';
    const lang = (window.MorphixApp && window.MorphixApp.getLang && window.MorphixApp.getLang()) || 'zh';
    try {
      return new Date(iso + 'T00:00:00').toLocaleDateString(
        lang === 'zh' ? 'zh-CN' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      );
    } catch (e) {
      return iso;
    }
  }

  // ---------------------------------------------------------------
  // Chart rendering (vanilla SVG)
  // ---------------------------------------------------------------
  function renderChartSVG(entries, target) {
    // entries expected in ASC date order (oldest first)
    if (!entries || entries.length === 0) {
      return '';
    }

    const W = 560;
    const H = 220;
    const padL = 44, padR = 18, padT = 16, padB = 32;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const allWeights = sorted.map((e) => e.weight);
    let yMin = Math.min(...allWeights);
    let yMax = Math.max(...allWeights);
    if (typeof target === 'number' && !Number.isNaN(target)) {
      yMin = Math.min(yMin, target);
      yMax = Math.max(yMax, target);
    }
    // Pad Y range slightly for visual breathing room
    const yRange = yMax - yMin || 1;
    yMin = yMin - yRange * 0.08;
    yMax = yMax + yRange * 0.08;

    // X scale: index-based (not time) for stable spacing
    const xStep = sorted.length > 1 ? innerW / (sorted.length - 1) : 0;
    const xAt = (i) => padL + i * xStep;
    const yAt = (v) => padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

    // Y grid lines (4 ticks)
    const yTicks = [];
    for (let i = 0; i <= 4; i++) {
      const v = yMin + (yMax - yMin) * (i / 4);
      yTicks.push({ v, y: yAt(v) });
    }

    // Build line path
    const pathD = sorted
      .map((e, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(e.weight).toFixed(1)}`)
      .join(' ');

    // Target line (dashed)
    let targetLine = '';
    if (typeof target === 'number' && !Number.isNaN(target)) {
      const ty = yAt(target);
      targetLine = `
        <line x1="${padL}" y1="${ty.toFixed(1)}" x2="${W - padR}" y2="${ty.toFixed(1)}"
              stroke="rgba(168, 85, 247, 0.7)" stroke-width="1.5" stroke-dasharray="4 4" />
        <text x="${W - padR - 4}" y="${(ty - 6).toFixed(1)}" text-anchor="end"
              class="wt-chart-target-label">${t('targetLabel')} ${target.toFixed(1)}kg</text>
      `;
    }

    // X axis labels (show up to 5 dates evenly)
    const labelCount = Math.min(5, sorted.length);
    const xLabels = [];
    for (let i = 0; i < labelCount; i++) {
      const idx = labelCount === 1 ? 0 : Math.round((i * (sorted.length - 1)) / (labelCount - 1));
      const entry = sorted[idx];
      const d = new Date(entry.date + 'T00:00:00');
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      xLabels.push({ x: xAt(idx), label });
    }

    return `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" class="wt-chart-svg" role="img" aria-label="${t('chartTitle')}">
        <defs>
          <linearGradient id="wtLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#00d4ff"/>
            <stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>
          <linearGradient id="wtAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(0, 212, 255, 0.25)"/>
            <stop offset="100%" stop-color="rgba(168, 85, 247, 0)"/>
          </linearGradient>
        </defs>

        ${yTicks.map((tk) => `
          <line x1="${padL}" y1="${tk.y.toFixed(1)}" x2="${W - padR}" y2="${tk.y.toFixed(1)}"
                stroke="rgba(255,255,255,0.05)" stroke-width="1" />
          <text x="${padL - 8}" y="${(tk.y + 3).toFixed(1)}" text-anchor="end" class="wt-chart-axis">${tk.v.toFixed(1)}</text>
        `).join('')}

        ${targetLine}

        <path d="${pathD} L ${xAt(sorted.length - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L ${xAt(0).toFixed(1)} ${(padT + innerH).toFixed(1)} Z"
              fill="url(#wtAreaGrad)" opacity="0.6" />
        <path d="${pathD}" fill="none" stroke="url(#wtLineGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        ${sorted.map((e, i) => `
          <circle cx="${xAt(i).toFixed(1)}" cy="${yAt(e.weight).toFixed(1)}" r="3.5"
                  fill="#0d1030" stroke="url(#wtLineGrad)" stroke-width="2" />
        `).join('')}

        ${xLabels.map((xl) => `
          <text x="${xl.x.toFixed(1)}" y="${(H - 10).toFixed(1)}" text-anchor="middle" class="wt-chart-axis">${xl.label}</text>
        `).join('')}
      </svg>
    `;
  }

  // ---------------------------------------------------------------
  // Stats (avg, weekly rate, weeks-to-goal)
  // ---------------------------------------------------------------
  function computeStats(entries, target) {
    if (!entries || entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];

    // 7-day average (last 7 entries)
    const recent = sorted.slice(-7);
    const avg = recent.reduce((s, e) => s + e.weight, 0) / recent.length;

    // Weekly rate (kg/wk) — linear regression of (day index, weight)
    let rate = null;
    if (sorted.length >= 2) {
      const t0 = new Date(sorted[0].date).getTime();
      const xs = sorted.map((e) => (new Date(e.date).getTime() - t0) / 86400000);
      const ys = sorted.map((e) => e.weight);
      const n = xs.length;
      const meanX = xs.reduce((s, v) => s + v, 0) / n;
      const meanY = ys.reduce((s, v) => s + v, 0) / n;
      let num = 0, den = 0;
      for (let i = 0; i < n; i++) {
        num += (xs[i] - meanX) * (ys[i] - meanY);
        den += (xs[i] - meanX) ** 2;
      }
      const slopePerDay = den === 0 ? 0 : num / den;
      rate = slopePerDay * 7; // kg per week
    }

    // Weeks to goal
    let weeks = null;
    if (typeof target === 'number' && rate !== null && Math.abs(rate) > 0.05) {
      const diff = target - latest.weight;
      if (Math.sign(diff) === Math.sign(rate) || Math.abs(diff) < 0.5) {
        weeks = Math.max(0, Math.abs(diff) / Math.abs(rate));
      } else {
        weeks = null; // moving away from target
      }
    }

    return { latest, avg, rate, weeks };
  }

  function formatWeeks(w) {
    if (w === null || w === undefined) return '—';
    if (w < 1) return '< 1';
    return `~${w.toFixed(1)}`;
  }

  // ---------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------
  function isProActive() {
    // No Pro gate until issue #13 ships. Surface the badge so the section
    // visibly positions itself as a future-Pro feature, but allow all
    // signed-in users to use the tracker until billing ships.
    return false;
  }

  function render() {
    const root = document.getElementById('weightTracker');
    if (!root) return;

    const session = getSession();

    // Not signed in → teaser only
    if (!session) {
      root.innerHTML = renderTeaser();
      bindTeaserClicks();
      return;
    }

    const entries = moduleState.entries;
    const targetInput = document.getElementById('targetWeight');
    const target = targetInput && targetInput.value
      ? parseFloat(targetInput.value)
      : moduleState.targetWeight;

    const pro = isProActive();
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const stats = computeStats(sorted, target);

    root.innerHTML = `
      <div class="wt-section">
        <div class="wt-section-header">
          <div>
            <div class="wt-section-tag">${t('sectionTag')}</div>
            <h2 class="wt-section-title">${t('sectionTitle')}</h2>
            <p class="wt-section-sub">${t('sectionSub')}</p>
          </div>
          ${pro ? '' : `<span class="wt-pro-badge">${t('proBadge')}</span>`}
        </div>

        <div class="wt-add-card">
          <div class="wt-add-title">${t('addTitle')}</div>
          <form id="wtAddForm" class="wt-form">
            <div class="wt-form-row">
              <div class="wt-field">
                <label for="wtDate">${t('dateLabel')}</label>
                <input type="date" id="wtDate" name="date" max="${todayISO()}" value="${todayISO()}" required />
              </div>
              <div class="wt-field">
                <label for="wtWeight">${t('weightLabel')}</label>
                <input type="number" id="wtWeight" name="weight" min="30" max="300" step="0.1" required />
              </div>
            </div>
            <div class="wt-field">
              <label for="wtNote">${t('noteLabel')}</label>
              <input type="text" id="wtNote" name="note" maxlength="120" placeholder="${t('notePlaceholder')}" />
            </div>
            <button type="submit" class="wt-submit" id="wtSubmitBtn">${t('addBtn')}</button>
            <div class="wt-form-msg" id="wtFormMsg" role="status" aria-live="polite"></div>
          </form>
        </div>

        <div class="wt-chart-card">
          <div class="wt-chart-header">
            <span class="wt-chart-title">${t('chartTitle')}</span>
            <span class="wt-chart-meta">${entries.length > 0 ? t('entries', entries.length) : t('noDataLabel')}</span>
          </div>
          ${entries.length === 0
            ? renderChartEmpty()
            : `<div class="wt-chart-wrap">${renderChartSVG(sorted, target)}</div>
               <div class="wt-stats">${renderStats(stats, target)}</div>`
          }
        </div>

        <div class="wt-list-card">
          <div class="wt-list-header">
            <span class="wt-list-title">${t('listTitle')}</span>
            ${entries.length > 0
              ? `<span class="wt-list-meta">${formatDate(entries[0].date)}</span>`
              : ''
            }
          </div>
          ${entries.length === 0
            ? `<p class="wt-list-empty">${t('listEmpty')}</p>`
            : `<ul class="wt-list" id="wtList">
                ${entries.slice(0, 10).map((e) => `
                  <li class="wt-list-item" data-id="${e.id}">
                    <div class="wt-list-date">${formatDate(e.date)}</div>
                    <div class="wt-list-weight">${e.weight.toFixed(1)} <span class="wt-unit">kg</span></div>
                    ${e.note ? `<div class="wt-list-note">${escapeHtml(e.note)}</div>` : ''}
                    <button type="button" class="wt-list-delete" data-id="${e.id}" aria-label="${t('deleteBtn')}">×</button>
                  </li>
                `).join('')}
              </ul>`
          }
        </div>
      </div>
    `;

    bindForm();
    bindListActions();
  }

  function renderTeaser() {
    return `
      <div class="wt-section">
        <div class="wt-section-header">
          <div>
            <div class="wt-section-tag">${t('sectionTag')}</div>
            <h2 class="wt-section-title">${t('sectionTitle')}</h2>
            <p class="wt-section-sub">${t('sectionSub')}</p>
          </div>
          <span class="wt-pro-badge">${t('proBadge')}</span>
        </div>
        <div class="wt-teaser">
          <div class="wt-teaser-graphic" aria-hidden="true">
            <svg viewBox="0 0 240 120" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="wtTeaserGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#00d4ff"/>
                  <stop offset="100%" stop-color="#a855f7"/>
                </linearGradient>
              </defs>
              <line x1="20" y1="60" x2="220" y2="60" stroke="rgba(168,85,247,0.6)" stroke-width="1.5" stroke-dasharray="4 4"/>
              <text x="222" y="56" text-anchor="end" font-size="9" fill="rgba(168,85,247,0.9)" font-family="sans-serif">target</text>
              <path d="M20 30 Q 60 50 100 55 T 180 75 T 220 90" fill="none" stroke="url(#wtTeaserGrad)" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="20" cy="30" r="3" fill="#00d4ff"/>
              <circle cx="80" cy="55" r="3" fill="#00d4ff"/>
              <circle cx="140" cy="75" r="3" fill="#a855f7"/>
              <circle cx="220" cy="90" r="3" fill="#a855f7"/>
            </svg>
          </div>
          <h3 class="wt-teaser-title">${t('proTeaserTitle')}</h3>
          <p class="wt-teaser-desc">${t('proTeaserDesc')}</p>
          <div class="wt-teaser-actions">
            <button type="button" class="wt-btn-primary" id="wtSignInBtn">${t('upgradeBtn')}</button>
            <a href="#features" class="wt-btn-ghost">${t('learnMore')}</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderChartEmpty() {
    return `
      <div class="wt-empty">
        <div class="wt-empty-icon" aria-hidden="true">📈</div>
        <div class="wt-empty-title">${t('chartEmptyTitle')}</div>
        <div class="wt-empty-desc">${t('chartEmptyDesc')}</div>
      </div>
    `;
  }

  function renderStats(stats, target) {
    if (!stats) return '';
    const { latest, avg, rate, weeks } = stats;
    const change = (typeof target === 'number' && !Number.isNaN(target))
      ? (latest.weight - target)
      : null;
    const changeStr = change === null
      ? '—'
      : `${change > 0 ? '+' : ''}${change.toFixed(1)} kg`;
    const changeCls = change === null
      ? ''
      : change < 0 ? 'wt-stat-pos' : change > 0 ? 'wt-stat-warn' : 'wt-stat-good';
    const rateStr = rate === null
      ? '—'
      : `${rate > 0 ? '+' : ''}${rate.toFixed(2)} kg/wk`;
    const rateCls = rate === null
      ? ''
      : (typeof target === 'number' && target < latest.weight && rate < 0)
        ? 'wt-stat-pos'
        : (typeof target === 'number' && target > latest.weight && rate > 0)
          ? 'wt-stat-pos'
          : 'wt-stat-warn';

    return `
      <div class="wt-stat">
        <div class="wt-stat-label">${t('currentLabel')}</div>
        <div class="wt-stat-value">${latest.weight.toFixed(1)}<span class="wt-unit">kg</span></div>
      </div>
      <div class="wt-stat">
        <div class="wt-stat-label">${t('avgLabel')}</div>
        <div class="wt-stat-value">${avg.toFixed(1)}<span class="wt-unit">kg</span></div>
      </div>
      <div class="wt-stat ${rateCls}">
        <div class="wt-stat-label">${t('weeklyRateLabel')}</div>
        <div class="wt-stat-value">${rateStr}</div>
      </div>
      <div class="wt-stat">
        <div class="wt-stat-label">${t('changeLabel')}</div>
        <div class="wt-stat-value ${changeCls}">${changeStr}</div>
      </div>
      ${weeks !== null
        ? `<div class="wt-stat">
            <div class="wt-stat-label">${t('weeksToGoalLabel')}</div>
            <div class="wt-stat-value">${formatWeeks(weeks)}</div>
          </div>`
        : ''
      }
    `;
  }

  // ---------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------
  function bindTeaserClicks() {
    const btn = document.getElementById('wtSignInBtn');
    if (btn && window.MorphixAuth && MorphixAuth.openAuthModal) {
      btn.addEventListener('click', () => MorphixAuth.openAuthModal());
    }
  }

  function bindForm() {
    const form = document.getElementById('wtAddForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dateEl = document.getElementById('wtDate');
      const weightEl = document.getElementById('wtWeight');
      const noteEl = document.getElementById('wtNote');
      const btn = document.getElementById('wtSubmitBtn');
      const msg = document.getElementById('wtFormMsg');

      const date = dateEl.value;
      const weight = parseFloat(weightEl.value);
      const note = noteEl ? noteEl.value : '';

      if (!date || Number.isNaN(weight)) {
        showFormMsg(msg, t('addError'), 'error');
        return;
      }
      if (weight < 30) {
        showFormMsg(msg, t('tooLow'), 'error');
        return;
      }
      if (weight > 300) {
        showFormMsg(msg, t('tooHigh'), 'error');
        return;
      }

      btn.disabled = true;
      const origLabel = btn.textContent;
      btn.textContent = t('adding');
      msg.textContent = '';
      msg.className = 'wt-form-msg';

      const res = await addEntry(weight, date, note);
      btn.disabled = false;
      btn.textContent = origLabel;

      if (!res.ok) {
        showFormMsg(msg, t('addError'), 'error');
        return;
      }

      showFormMsg(msg, t('addSuccess'), 'success');
      weightEl.value = '';
      if (noteEl) noteEl.value = '';
      // refresh from DB so order is canonical
      await loadEntries();
      render();
    });
  }

  function bindListActions() {
    const list = document.getElementById('wtList');
    if (!list) return;
    list.addEventListener('click', async (e) => {
      const btn = e.target.closest('.wt-list-delete');
      if (!btn) return;
      const id = btn.dataset.id;
      if (!id) return;
      if (!window.confirm(t('deleteConfirm'))) return;
      const res = await deleteEntry(id);
      if (res.ok) {
        await loadEntries();
        render();
      } else {
        alert(t('loadError'));
      }
    });
  }

  function showFormMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = 'wt-form-msg' + (type ? ' wt-form-msg--' + type : '');
    if (type === 'success') {
      setTimeout(() => {
        el.textContent = '';
        el.className = 'wt-form-msg';
      }, 2200);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ---------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------
  async function init() {
    const root = document.getElementById('weightTracker');
    if (!root) return;
    if (!window.MorphixSupabase || !window.MorphixSupabase.isConfigured()) {
      root.style.display = 'none';
      return;
    }

    const session = getSession();
    if (session) {
      moduleState.loading = true;
      render();
      await loadEntries();
      moduleState.loading = false;
    }
    render();
  }

  async function refresh() {
    if (getSession()) {
      await loadEntries();
    }
    render();
  }

  function setTargetWeight(weight) {
    moduleState.targetWeight = weight;
    render();
  }

  // Expose
  window.MorphixWeight = {
    init,
    refresh,
    setTargetWeight,
    // Exposed for tests / debug
    _state: moduleState,
    _computeStats: computeStats,
    _renderChartSVG: renderChartSVG,
  };
})();
