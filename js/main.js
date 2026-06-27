/* ============================
   BUTTON EVENTS
   ============================ */
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

/* ============================
   INFO MODAL
   ============================ */
btnInfo.addEventListener('click', () => infoModal.classList.add('open'));
btnCloseInfo.addEventListener('click', () => infoModal.classList.remove('open'));
infoModal.addEventListener('click', (e) => {
  if (e.target === infoModal) infoModal.classList.remove('open');
});

/* ============================
   NOTES TOGGLE
   ============================ */
btnNotes.addEventListener('click', () => {
  notesPanel.classList.toggle('open');
});

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

  if (e.code === 'Escape' && infoModal.classList.contains('open')) {
    infoModal.classList.remove('open');
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
