/* ============================
   NOTES (localStorage)
   ============================ */
const NOTES_KEY = 'pomodoro_notes';

function loadNotes() {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (!data) return defaultNotes();
    return JSON.parse(data);
  } catch (_) {
    return defaultNotes();
  }
}

function saveNotesData(data) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(data));
}

function defaultNotes() {
  const id = 'n1';
  return { windows: [{ id, name: 'Sem título', content: '' }], activeId: id };
}

function renderNotes() {
  const data = loadNotes();
  const { windows, activeId } = data;
  const active = windows.find(w => w.id === activeId) || windows[0];

  notesTabs.innerHTML = '';

  if (windows.length === 0) {
    notesTabs.innerHTML = '<div class="empty-notes">Nenhuma janela</div>';
    notesEditor.value = '';
    notesEditor.disabled = true;
    return;
  }

  notesEditor.disabled = false;

  windows.forEach(w => {
    const isActive = w.id === active.id;
    const tab = document.createElement('div');
    tab.className = `note-tab${isActive ? ' active' : ''}`;
    tab.dataset.id = w.id;

    const name = document.createElement('span');
    name.className = 'note-tab-name';
    name.textContent = w.name;
    name.title = 'Clique para renomear';

    const del = document.createElement('button');
    del.className = 'note-tab-del';
    del.textContent = '✕';
    del.title = 'Deletar janela';

    name.addEventListener('click', (e) => {
      e.stopPropagation();
      const newName = prompt('Novo nome:', w.name);
      if (newName && newName.trim() && newName.trim() !== w.name) {
        w.name = newName.trim();
        saveNotesData(data);
        renderNotes();
      }
    });

    del.addEventListener('click', (e) => {
      e.stopPropagation();
      if (windows.length <= 1) return;
      if (w.content && w.content.trim() && !confirm(`Deletar "${w.name}"?`)) return;
      const idx = windows.indexOf(w);
      windows.splice(idx, 1);
      if (data.activeId === w.id) {
        data.activeId = windows[Math.min(idx, windows.length - 1)].id;
      }
      saveNotesData(data);
      renderNotes();
    });

    tab.addEventListener('click', () => {
      if (data.activeId === w.id) return;
      const cur = windows.find(x => x.id === data.activeId);
      if (cur) cur.content = notesEditor.value;
      data.activeId = w.id;
      saveNotesData(data);
      renderNotes();
    });

    tab.appendChild(name);
    tab.appendChild(del);
    notesTabs.appendChild(tab);
  });

  notesEditor.value = active.content || '';
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const saveNoteContent = debounce(() => {
  const data = loadNotes();
  const active = data.windows.find(w => w.id === data.activeId);
  if (active) {
    active.content = notesEditor.value;
    saveNotesData(data);
  }
}, 500);

notesEditor.addEventListener('input', saveNoteContent);

addNoteBtn.addEventListener('click', () => {
  const data = loadNotes();
  if (data.windows.length >= 10) {
    alert('Máximo de 10 janelas.');
    return;
  }
  const id = 'n' + Date.now();
  const cur = data.windows.find(w => w.id === data.activeId);
  if (cur) cur.content = notesEditor.value;
  data.windows.push({ id, name: `Sem título ${data.windows.length + 1}`, content: '' });
  data.activeId = id;
  saveNotesData(data);
  renderNotes();
  notesEditor.focus();
});
