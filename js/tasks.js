/* ============================
   TASK LIST (localStorage)
   ============================ */
const STORAGE_KEY = 'pomodoro_tasks';

function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (_) {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = loadTasks();
  listaItens.innerHTML = '';

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total > 0 ? (done / total) * 100 : 0;
  taskProgressFill.style.width = `${pct}%`;
  taskProgressText.textContent = `${done}/${total}`;

  if (tasks.length === 0) {
    listaItens.innerHTML = '<li class="empty-tasks">Nenhuma tarefa ainda</li>';
    return;
  }

  const pending = tasks.filter(t => !t.done);
  const doneList = tasks.filter(t => t.done);

  function createTaskItem(task) {
    const li = document.createElement('li');
    li.className = `task-item${task.done ? ' done' : ''}`;

    const check = document.createElement('span');
    check.className = 'task-check';
    check.textContent = task.done ? '✓' : '';

    const text = document.createElement('span');
    text.textContent = task.text;

    const del = document.createElement('button');
    del.className = 'task-delete';
    del.textContent = '✕';
    del.setAttribute('aria-label', 'Remover tarefa');

    li.addEventListener('click', (e) => {
      if (e.target === del) return;
      task.done = !task.done;
      saveTasks(tasks);
      renderTasks();
    });

    del.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = tasks.indexOf(task);
      if (idx > -1) tasks.splice(idx, 1);
      saveTasks(tasks);
      renderTasks();
    });

    li.appendChild(check);
    li.appendChild(text);
    li.appendChild(del);
    return li;
  }

  pending.forEach(task => listaItens.appendChild(createTaskItem(task)));
  if (doneList.length > 0) {
    const divider = document.createElement('li');
    divider.className = 'task-divider';
    divider.textContent = `Concluídas (${doneList.length})`;
    listaItens.appendChild(divider);
    doneList.forEach(task => listaItens.appendChild(createTaskItem(task)));
  }
}

function addTask(text) {
  if (!text.trim()) return;
  const tasks = loadTasks();
  tasks.push({ text: text.trim(), done: false });
  saveTasks(tasks);
  renderTasks();
}

addBtn.addEventListener('click', () => {
  addTask(itemInput.value);
  itemInput.value = '';
});

itemInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask(itemInput.value);
    itemInput.value = '';
  }
});
