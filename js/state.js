/* ============================
   CONSTANTS & STATE
   ============================ */
const CIRCUMFERENCE = 2 * Math.PI * 125; // ~785.4

const MODES = {
  foco:     { label: 'Foco',     defaultMin: 25, color: '#d4957a' },
  descanso: { label: 'Descanso', defaultMin: 5,  color: '#8aaa9a' },
};

const DICAS = [
  'Respire fundo e mantenha o foco! 🌟',
  'Você está fazendo um ótimo trabalho!',
  'Hora de alongar e beber água 💧',
  'Pausas curtas aumentam a produtividade',
  'Mantenha o ritmo, você consegue!',
  'Um passo de cada vez 🎯',
];

const state = {
  mode: 'foco',
  timeLeft: 0,
  totalTime: 0,
  isRunning: false,
  isPaused: false,
  intervalId: null,
  pomodorosCompleted: loadPomodorosCompleted(),
  soundEnabled: true,
  ambientAudio: null,
  ambientType: 'none',
};

const POMODOROS_KEY = 'pomodoro_sessions_completed';

function loadPomodorosCompleted() {
  try {
    const val = localStorage.getItem(POMODOROS_KEY);
    const n = parseInt(val, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function savePomodorosCompleted(val) {
  localStorage.setItem(POMODOROS_KEY, String(val));
}

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
