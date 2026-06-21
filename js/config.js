/* ============================
   CUSTOM THEME
   ============================ */
const THEME_KEY = 'pomodoro_theme';

function loadTheme() {
  try {
    const data = localStorage.getItem(THEME_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch { return null; }
}

function saveTheme(colors) {
  localStorage.setItem(THEME_KEY, JSON.stringify(colors));
}

function applyTheme(colors) {
  if (!colors) return;
  const root = document.documentElement;
  if (colors.foco)  root.style.setProperty('--foco', colors.foco);
  if (colors.curta) root.style.setProperty('--curta', colors.curta);
  if (colors.longa) root.style.setProperty('--longa', colors.longa);
  corFoco.value  = colors.foco  || corFoco.value;
  corCurta.value = colors.curta || corCurta.value;
  corLonga.value = colors.longa || corLonga.value;
  setTheme(state.mode);
}

function applyConfig() {
  const colors = {
    foco: corFoco.value,
    curta: corCurta.value,
    longa: corLonga.value,
  };
  saveTheme(colors);
  applyTheme(colors);

  if (!state.isRunning && !state.isPaused) {
    resetTimer();
  }
}

/* ============================
   STATISTICS
   ============================ */
const STATS_KEY = 'pomodoro_stats';

function loadStats() {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return createDefaultStats();
    return JSON.parse(data);
  } catch { return createDefaultStats(); }
}

function createDefaultStats() {
  return { totalPomodoros: 0, totalFocusSeconds: 0, date: today() };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function trackFocusSession(seconds) {
  let stats = loadStats();
  if (stats.date !== today()) stats = createDefaultStats();
  stats.totalPomodoros++;
  stats.totalFocusSeconds += seconds;
  stats.date = today();
  saveStats(stats);
}

function updateStats() {
  const stats = loadStats();
  if (stats.date !== today()) {
    statPomodoros.textContent = '0 pomodoros';
    statFocoHoje.textContent = '0min focado hoje';
    return;
  }
  const mins = Math.round(stats.totalFocusSeconds / 60);
  statPomodoros.textContent = `${stats.totalPomodoros} pomodoro${stats.totalPomodoros !== 1 ? 's' : ''}`;
  statFocoHoje.textContent = `${mins}min focado hoje`;
}

/* ============================
   NOTIFICATION
   ============================ */
function showNotification(text) {
  mensagem.textContent = text;
  mensagem.classList.toggle('show', !!text);
}

/* ============================
   CONFIG PANEL
   ============================ */
btnConfig.addEventListener('click', () => {
  configPanel.classList.toggle('open');
});

$('#btnAplicarConfig').addEventListener('click', applyConfig);

/* ============================
   LAYOUT TOGGLE
   ============================ */
const LAYOUT_KEY = 'pomodoro_layout';
let drawerOpen = false;

function getLayout() {
  try { return localStorage.getItem(LAYOUT_KEY) || 'center'; }
  catch { return 'center'; }
}

function setLayout(mode) {
  const isLeft = mode === 'left';
  document.body.classList.toggle('layout-left', isLeft);
  localStorage.setItem(LAYOUT_KEY, mode);
  updateDrawerState();
}

function updateDrawerState() {
  const isLeft = document.body.classList.contains('layout-left');
  drawerToggle.style.display = isLeft ? 'flex' : 'none';
  if (!isLeft) {
    configPanel.classList.remove('open');
    drawerOpen = false;
    document.querySelector('.bottom-panels').classList.remove('open');
  }
}

function toggleLayout() {
  const current = getLayout();
  setLayout(current === 'center' ? 'left' : 'center');
}

btnLayout.addEventListener('click', toggleLayout);

drawerToggle.addEventListener('click', () => {
  drawerOpen = !drawerOpen;
  const panels = document.querySelector('.bottom-panels');
  panels.classList.toggle('open', drawerOpen);
  drawerLabel.textContent = drawerOpen ? 'Fechar' : 'Abrir';
});
