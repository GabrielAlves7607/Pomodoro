/* ============================
   CONSTANTS & STATE
   ============================ */
const CIRCUMFERENCE = 2 * Math.PI * 125; // ~785.4

const MODES = {
  foco:  { label: 'Foco',        defaultMin: 25, color: '#d4957a' },
  curta: { label: 'Pausa Curta', defaultMin: 5,  color: '#8aaa9a' },
  longa: { label: 'Pausa Longa', defaultMin: 15, color: '#9a8ab8' },
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
  pomodorosCompleted: 0,
  soundEnabled: true,
  ambientAudio: null,
  ambientType: 'none',
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
