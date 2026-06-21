/* ============================
   BUTTON EVENTS
   ============================ */
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

/* ============================
   KEYBOARD SHORTCUTS
   ============================ */
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (state.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  if (e.code === 'KeyR') {
    e.preventDefault();
    resetTimer();
  }
});

/* ============================
   INIT
   ============================ */
const savedTheme = loadTheme();
if (savedTheme) applyTheme(savedTheme);

setTheme('foco');
setLayout(getLayout());
updateStats();
resetTimer();
renderTasks();
renderNotes();
pauseBtn.style.display = 'none';
