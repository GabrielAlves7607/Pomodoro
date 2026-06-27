/* ============================
   THEME COLOR (accent)
   ============================ */
function setTheme(mode) {
  const root = document.documentElement;
  const modeVar = getComputedStyle(root).getPropertyValue(`--${mode}`).trim();
  const accent = modeVar || MODES[mode].color;

  root.style.setProperty('--accent', accent);

  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = accent;

  modeBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  if (!state.isRunning) {
    pauseBtn.style.display = 'none';
  }
}

/* ============================
   DISPLAY & PROGRESS
   ============================ */
function updateDisplay() {
  const mins = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const secs = (state.timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

function updateProgress(ratio) {
  const offset = CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, ratio)));
  progressRing.style.strokeDashoffset = offset;
}

function updatePomodoroCount() {
  pomodoroCount.textContent = `${state.pomodorosCompleted} ☕`;
}

/* ============================
   TIMER CORE
   ============================ */
function getModeMinutes() {
  const m = state.mode;
  if (m === 'foco')  return parseFloat(inputEstudo.value) || MODES.foco.defaultMin;
  return parseFloat(inputPausa.value) || MODES.descanso.defaultMin;
}

function stopTimer() {
  clearInterval(state.intervalId);
  state.intervalId = null;
  state.isRunning = false;
  state.isPaused = false;
}

function resetTimer() {
  stopTimer();
  state.isPaused = false;

  const minutes = getModeMinutes();
  state.totalTime = Math.round(minutes * 60);
  state.timeLeft = state.totalTime;
  updateDisplay();
  updateProgress(1);
  timerLabel.textContent = MODES[state.mode].label;
  statusMsg.textContent = 'Pronto para focar 🎯';
  showNotification('');
  startBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Iniciar`;
  pauseBtn.style.display = 'none';
}

function runInterval() {
  if (state.intervalId) clearInterval(state.intervalId);

  state.intervalId = setInterval(() => {
    if (state.timeLeft > 0) {
      state.timeLeft--;
      updateDisplay();
      updateProgress(state.timeLeft / state.totalTime);
    }

    if (state.timeLeft <= 0) {
      clearInterval(state.intervalId);
      state.intervalId = null;
      state.isRunning = false;
      state.isPaused = false;
      pauseBtn.style.display = 'none';
      onCycleComplete();
    }
  }, 1000);
}

function startTimer() {
  ensureBeepCtx();

  if (state.isPaused) {
    state.isPaused = false;
    state.isRunning = true;
    runInterval();
    startBtn.innerHTML = 'Rodando ⏳';
    pauseBtn.style.display = 'inline-flex';
    statusMsg.textContent = state.mode === 'foco'
      ? 'Foco ativo! 🚀'
      : 'Descansando... ☕';
    return;
  }

  if (state.intervalId) return;

  if (state.timeLeft <= 0) {
    const minutes = getModeMinutes();
    state.totalTime = Math.round(minutes * 60);
    state.timeLeft = state.totalTime;
  }

  state.isRunning = true;
  runInterval();
  startBtn.innerHTML = '⏳ Rodando';
  pauseBtn.style.display = 'inline-flex';
  statusMsg.textContent = MODES[state.mode].label === 'Foco'
    ? 'Foco ativo! 🚀'
    : 'Descansando... ☕';
}

function pauseTimer() {
  if (!state.isRunning && !state.isPaused) return;

  clearInterval(state.intervalId);
  state.intervalId = null;
  state.isRunning = false;
  state.isPaused = true;
  pauseBtn.style.display = 'none';
  startBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Continuar`;
  statusMsg.textContent = 'Pausado ⏸️';
  updateStats();
}

/* ============================
   CYCLE COMPLETE
   ============================ */
function onCycleComplete() {
  playSound();

  if (state.mode === 'foco') {
    state.pomodorosCompleted++;
    savePomodorosCompleted(state.pomodorosCompleted);
    updatePomodoroCount();
    trackFocusSession(state.totalTime);
    updateStats();

    const dica = DICAS[Math.floor(Math.random() * DICAS.length)];
    showNotification(`✅ Pomodoro completo! ${dica}`);
    statusMsg.textContent = 'Hora de descansar! ☕';

    switchMode('descanso');
  } else {
    showNotification('⏰ Descanso encerrado! Hora de focar');
    statusMsg.textContent = 'De volta ao foco! 🎯';
    switchMode('foco');
  }
}

/* ============================
   MODE SWITCHING
   ============================ */
function switchMode(mode) {
  if (mode === state.mode) return;

  state.mode = mode;
  setTheme(mode);
  resetTimer();
}

modeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === state.mode) return;
    switchMode(mode);
  });
});
