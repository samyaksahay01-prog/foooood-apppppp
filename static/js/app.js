/* ═══════════════════════════════════════════════════════
   NUTRISENSE — Frontend Application Logic
   ═══════════════════════════════════════════════════════ */

'use strict';

// ─── State ────────────────────────────────────────────
const state = {
  waterFilled: 5,
  waterGoal: 8,
  activeView: 'dashboard',
  nudgeData: null,
  dashData: null,
};

// ─── DOM Helpers ──────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Init ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setDate();
  setupNav();
  setupModals();
  setupVoiceLog();

  // Boot all data in parallel
  Promise.all([
    fetchDashboard(),
    fetchBiometrics(),
    fetchNudges(),
    fetchFoodLog(),
    fetchGrocery(),
    fetchFridge(),
    fetchBadges(),
  ]);
});

// ─── Date ─────────────────────────────────────────────
function setDate() {
  const opts = { weekday: 'long', month: 'short', day: 'numeric' };
  $('topbar-date').textContent = new Date().toLocaleDateString('en-US', opts);
}

// ─── Navigation ───────────────────────────────────────
const VIEW_TITLES = {
  dashboard: 'Dashboard',
  foodlog:   'Food Log',
  grocery:   'Grocery Map',
  fridge:    'Social Fridge',
  badges:    'Achievements',
};

function setupNav() {
  $$('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
    });
  });
}

function switchView(view) {
  state.activeView = view;

  // Buttons
  $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === view));

  // Sections
  $$('.view').forEach((s) => {
    const isTarget = s.id === `view-${view}`;
    s.classList.toggle('active', isTarget);
    s.classList.toggle('hidden', !isTarget);
  });

  $('view-title').textContent = VIEW_TITLES[view] ?? 'NutriSense';
}

// ─── Modals ───────────────────────────────────────────
function setupModals() {
  // Nudge open buttons
  $('nudge-trigger-btn').addEventListener('click', () => openModal('nudge-modal'));
  $('show-nudge-btn').addEventListener('click', () => openModal('nudge-modal'));

  // Nudge dismiss
  $('nudge-dismiss').addEventListener('click', () => closeModal('nudge-modal'));
  $('nudge-modal').addEventListener('click', (e) => {
    if (e.target === $('nudge-modal')) closeModal('nudge-modal');
  });

  // Voice modal open
  $('voice-log-btn').addEventListener('click', () => openModal('voice-modal'));
  $('open-voice-btn-2').addEventListener('click', () => openModal('voice-modal'));
  $('open-voice-from-log').addEventListener('click', () => openModal('voice-modal'));

  // Voice dismiss
  $('voice-dismiss').addEventListener('click', () => closeModal('voice-modal'));
  $('voice-modal').addEventListener('click', (e) => {
    if (e.target === $('voice-modal')) closeModal('voice-modal');
  });
}

function openModal(id)  { $(id).classList.remove('hidden'); }
function closeModal(id) { $(id).classList.add('hidden'); }

// ─── Voice Log Logic ──────────────────────────────────
function setupVoiceLog() {
  const input  = $('voice-input');
  const parsed = $('voice-parsed');
  const parsedText = $('voice-parsed-text');

  // Simulate parsing after user types
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    parsed.classList.add('hidden');
    if (input.value.trim().length < 5) return;
    timer = setTimeout(() => {
      parsedText.textContent = `Detected: "${input.value.trim()}" — estimated 320 kcal · 18g protein · 30g carbs`;
      parsed.classList.remove('hidden');
    }, 700);
  });

  $('voice-confirm').addEventListener('click', () => {
    if (!input.value.trim()) return;
    showToast(`✓ Logged: "${input.value.trim()}"`);
    input.value = '';
    parsed.classList.add('hidden');
    closeModal('voice-modal');
  });
}

// ─── Toast ────────────────────────────────────────────
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position:   'fixed',
    bottom:     '2rem',
    right:      '2rem',
    background: 'var(--jade)',
    color:      'var(--midnight)',
    padding:    '.75rem 1.4rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize:   '.9rem',
    zIndex:     '999',
    boxShadow:  'var(--shadow)',
    animation:  'toastIn .3s ease forwards',
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Inject toast animation
const toastStyle = document.createElement('style');
toastStyle.textContent = `@keyframes toastIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;
document.head.appendChild(toastStyle);

/* ═══════════════════════════════════════════════════════
   API FETCHERS & RENDERERS
═══════════════════════════════════════════════════════ */

// ─── DASHBOARD ───────────────────────────────────────
async function fetchDashboard() {
  const data = await api('/api/dashboard');
  state.dashData = data;

  // NQS ring animation
  animateRing('nqs-ring-fill', data.nqs_score, 100, 327);
  $('nqs-value').textContent = data.nqs_score;

  const delta = data.nqs_delta;
  const chip  = $('nqs-delta');
  chip.textContent = (delta >= 0 ? '+' : '') + delta;
  chip.className = `delta-chip ${delta >= 0 ? 'positive' : 'negative'}`;

  // NQS caption
  $('nqs-caption').textContent =
    data.nqs_score >= 75
      ? `Great progress! Your 7-day avg is ${data.weekly_nqs_avg}. Keep the streak going.`
      : `Your 7-day avg is ${data.weekly_nqs_avg}. Focus on protein & micronutrients today.`;

  // Bar chart
  renderWeekChart(data.nqs_history);

  // Streak
  $('streak-value').textContent = data.streak_days;
  const pct = Math.min((data.streak_days / data.next_reward_at) * 100, 100);
  $('streak-fill').style.width = pct + '%';
  const remaining = data.next_reward_at - data.streak_days;
  $('streak-goal-label').textContent = remaining > 0
    ? `${remaining} more day${remaining > 1 ? 's' : ''} to next reward`
    : '🏆 Reward unlocked!';
  $('freeze-count').textContent = data.streak_freeze_available;

  // Budget ring
  const budgetPct = (data.budget_remaining / data.budget_total) * 100;
  animateRing('budget-ring-fill', budgetPct, 100, 214);
  $('budget-remaining').textContent = '$' + data.budget_remaining.toFixed(2);
  $('budget-caption').textContent = `of $${data.budget_total.toFixed(2)} weekly budget`;

  // Water
  state.waterFilled = data.water_glasses;
  state.waterGoal = data.water_goal;
  renderWaterGlasses();

  // Target
  $('target-headline').textContent = data.next_meal_target;
  $('target-sub').textContent = 'Biometric sync suggests prioritising these nutrients in your next meal.';

  // Sidebar user
  $('user-name').textContent = data.user.name;
  $('user-tier').textContent = data.user.tier;
  $('user-avatar').textContent = data.user.avatar;
}

function animateRing(id, value, max, circumference) {
  const el = $(id);
  if (!el) return;
  setTimeout(() => {
    const dashVal = (value / max) * circumference;
    el.setAttribute('stroke-dasharray', `${dashVal} ${circumference}`);
  }, 150);
}

function renderWeekChart(history) {
  const container = $('nqs-week-chart');
  container.innerHTML = '';
  const maxVal = Math.max(...history);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  history.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.className = 'week-bar' + (i === history.length - 1 ? ' today' : '');
    bar.style.height = Math.round((val / maxVal) * 100) + '%';
    bar.title = `${days[i]}: ${val} NQS`;
    container.appendChild(bar);
  });
}

function renderWaterGlasses() {
  const container = $('water-glasses');
  container.innerHTML = '';
  for (let i = 0; i < state.waterGoal; i++) {
    const g = document.createElement('span');
    g.className = 'water-glass' + (i < state.waterFilled ? ' filled' : '');
    g.textContent = '💧';
    g.title = i < state.waterFilled ? 'Logged' : 'Click to log';
    g.addEventListener('click', () => {
      if (i >= state.waterFilled) {
        state.waterFilled = i + 1;
        renderWaterGlasses();
        $('water-caption').textContent = `${state.waterFilled} of ${state.waterGoal} glasses logged`;
        if (state.waterFilled === state.waterGoal) showToast('🎉 Hydration goal complete!');
      }
    });
    container.appendChild(g);
  }
  $('water-caption').textContent = `${state.waterFilled} of ${state.waterGoal} glasses logged`;
}

// ─── BIOMETRICS ──────────────────────────────────────
async function fetchBiometrics() {
  const data = await api('/api/biometrics');

  $('bio-sleep').textContent  = `${data.sleep_hours}h (${data.sleep_quality})`;
  $('bio-cortisol').textContent = data.cortisol_label;
  $('bio-hrv').textContent    = `${data.hrv} ms`;
  $('bio-steps').textContent  = data.steps_today.toLocaleString();

  setTimeout(() => {
    $('readiness-fill').style.width = data.readiness_score + '%';
  }, 300);
  $('readiness-val').textContent = data.readiness_score;
}

// ─── NUDGES ───────────────────────────────────────────
async function fetchNudges() {
  const data = await api('/api/nudges');
  state.nudgeData = data;

  $('nudge-time').textContent     = data.time;
  $('nudge-title').textContent    = data.message;
  $('nudge-sub').textContent      = data.sub_message;

  const container = $('nudge-options');
  container.innerHTML = '';
  data.suggestions.forEach((s) => {
    const el = document.createElement('div');
    el.className = 'nudge-option';
    el.innerHTML = `
      <div class="option-icon">${s.icon}</div>
      <div class="option-body">
        <div class="option-name">${s.name}</div>
        <div class="option-macros">${s.macros}</div>
        <div class="option-desc">${s.description}</div>
      </div>
      <div class="option-nqs">${s.nqs_impact} NQS</div>
    `;
    el.addEventListener('click', () => {
      showToast(`✓ Logged: ${s.name}`);
      closeModal('nudge-modal');
    });
    container.appendChild(el);
  });
}

// ─── FOOD LOG ─────────────────────────────────────────
async function fetchFoodLog() {
  const data = await api('/api/foodlog');

  // Macro bars
  renderMacroBar('bar-calories', 'val-calories', data.today_calories, data.calorie_target, 'kcal');
  renderMacroBar('bar-protein',  'val-protein',  data.macros.protein,  data.macro_targets.protein,  'g');
  renderMacroBar('bar-carbs',    'val-carbs',    data.macros.carbs,    data.macro_targets.carbs,    'g');
  renderMacroBar('bar-fat',      'val-fat',      data.macros.fat,      data.macro_targets.fat,      'g');
  renderMacroBar('bar-fiber',    'val-fiber',    data.macros.fiber,    data.macro_targets.fiber,    'g');

  // Entries
  const container = $('log-entries');
  container.innerHTML = '';
  data.entries.forEach((entry) => {
    const nqsColor = entry.nqs >= 80 ? 'var(--jade)' : entry.nqs >= 65 ? 'var(--amber)' : 'var(--coral)';
    const el = document.createElement('div');
    el.className = 'log-entry';
    el.innerHTML = `
      <div class="log-entry-icon">${entry.icon}</div>
      <div class="log-entry-body">
        <div class="log-entry-name">${entry.name}</div>
        <div class="log-entry-time">${entry.time}</div>
      </div>
      <div class="log-entry-cals">${entry.calories} kcal</div>
      <div class="log-entry-nqs" style="color:${nqsColor}">${entry.nqs} NQS</div>
    `;
    container.appendChild(el);
  });
}

function renderMacroBar(barId, valId, current, target, unit) {
  const pct = Math.min((current / target) * 100, 100);
  setTimeout(() => { $(barId).style.width = pct + '%'; }, 200);
  $(valId).textContent = `${current}/${target}${unit}`;
}

// ─── GROCERY ─────────────────────────────────────────
async function fetchGrocery() {
  const data = await api('/api/grocery');

  $('grocery-week').textContent = data.week;

  const budgetPct = ((data.budget_total - data.budget_remaining) / data.budget_total) * 100;
  setTimeout(() => { $('budget-pill-fill').style.width = budgetPct + '%'; }, 300);
  $('budget-pill-label').textContent =
    `$${(data.budget_total - data.budget_remaining).toFixed(2)} of $${data.budget_total.toFixed(2)} used`;

  const list = $('grocery-list');
  list.innerHTML = '';
  data.items.forEach((item) => {
    const el = document.createElement('div');
    el.className = `grocery-item priority-${item.priority}`;
    el.innerHTML = `
      <div class="grocery-icon">${item.icon}</div>
      <div class="grocery-body">
        <div class="grocery-name">${item.name}</div>
        <div class="grocery-reason">↑ ${item.reason}</div>
        <div class="grocery-price">$${item.price.toFixed(2)} · ${item.category}</div>
      </div>
    `;
    list.appendChild(el);
  });

  // Swap suggestions
  const swapContainer = $('swap-suggestion');
  swapContainer.innerHTML = '';
  data.substitutions.forEach((swap) => {
    const el = document.createElement('div');
    el.className = 'swap-row';
    el.innerHTML = `
      <span class="swap-out">${swap.swap_out}</span>
      <span class="swap-arrow">→</span>
      <span class="swap-in">${swap.swap_in}</span>
      <span class="swap-benefit pill pill-jade">saves $${swap.savings} · ${swap.benefit}</span>
    `;
    swapContainer.appendChild(el);
  });
}

// ─── SOCIAL FRIDGE ────────────────────────────────────
async function fetchFridge() {
  const data = await api('/api/fridge');

  $('fridge-nearby').textContent = data.nearby_users;
  $('fridge-karma').textContent  = data.karma_points;
  $('karma-rank').textContent    = data.karma_rank;

  const grid = $('fridge-grid');
  grid.innerHTML = '';
  data.items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'fridge-item-card';
    el.innerHTML = `
      <div class="fridge-item-top">
        <div class="fridge-item-icon">${item.icon}</div>
        <div>
          <div class="fridge-item-name">${item.item}</div>
          <div class="fridge-item-qty">${item.quantity} · expires in ${item.expires_in}</div>
        </div>
      </div>
      <div class="fridge-user-row">
        <div class="fridge-user-avatar">${item.avatar}</div>
        <span class="fridge-user-name">${item.user}</span>
        <span class="fridge-distance">📍 ${item.distance}</span>
      </div>
      <div class="fridge-match-reason">✨ ${item.match_reason}</div>
      <div class="fridge-match-score">
        <span class="muted" style="font-size:.7rem">Match</span>
        <div class="match-bar"><div class="match-bar-fill" style="width:${item.match_score}%"></div></div>
        <span class="match-val">${item.match_score}%</span>
      </div>
      <button class="btn btn-primary btn-sm full-width" onclick="handleSwapRequest('${item.item}', '${item.user}')">
        Request Swap
      </button>
    `;
    grid.appendChild(el);
  });

  // My Offerings
  const offerings = $('my-offerings-grid');
  offerings.innerHTML = '';
  data.my_offerings.forEach((o) => {
    const el = document.createElement('div');
    el.className = 'offering-card';
    el.innerHTML = `
      <div class="offering-icon">${o.icon}</div>
      <div>
        <div class="offering-name">${o.item}</div>
        <div class="offering-expiry">Exp: ${o.expires_in}</div>
        <div class="offering-status" style="color:${o.claimed ? 'var(--jade)' : 'var(--amber)'}">
          ${o.claimed ? '✓ Claimed' : '⏳ Available'}
        </div>
      </div>
    `;
    offerings.appendChild(el);
  });
}

function handleSwapRequest(item, user) {
  showToast(`✓ Swap request sent to ${user} for ${item}!`);
}

// ─── BADGES ───────────────────────────────────────────
async function fetchBadges() {
  const data = await api('/api/badges');

  // Earned
  const earnedGrid = $('earned-badges-grid');
  earnedGrid.innerHTML = '';
  data.earned.forEach((b) => {
    const el = document.createElement('div');
    el.className = 'badge-card';
    el.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.description}</div>
      <div class="badge-date">Earned ${b.earned_date}</div>
    `;
    earnedGrid.appendChild(el);
  });

  // Upcoming
  const upcomingList = $('upcoming-badges-list');
  upcomingList.innerHTML = '';
  data.upcoming.forEach((b) => {
    const el = document.createElement('div');
    el.className = 'upcoming-badge';
    el.innerHTML = `
      <div class="upcoming-icon">${b.icon}</div>
      <div class="upcoming-body">
        <div class="upcoming-name">${b.name}</div>
        <div class="upcoming-desc">${b.description}</div>
        <div class="upcoming-progress-wrap">
          <div class="upcoming-bar">
            <div class="upcoming-bar-fill" style="width:${b.progress}%"></div>
          </div>
          <span class="upcoming-pct">${b.progress}%</span>
        </div>
      </div>
    `;
    upcomingList.appendChild(el);
  });
}

/* ═══════════════════════════════════════════════════════
   API UTILITY
═══════════════════════════════════════════════════════ */
async function api(endpoint) {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[NutriSense] API error: ${endpoint}`, err);
    return null;
  }
}
