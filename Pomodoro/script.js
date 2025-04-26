// === Variáveis Globais ===
let tempo = 0;
let tempoEstudo = 25 * 60;
let tempoPausa = 5 * 60;
let emPausa = false;
let intervalo;

const display = document.getElementById('timer');
const mensagem = document.getElementById('mensagem');
const inputEstudo = document.getElementById('tempoEstudo');
const inputPausa = document.getElementById('tempoPausa');
const titulo = document.getElementById('titulo');

// === Dicas Motivacionais ===
const dicas = [
  "Respire fundo e continue focado!",
  "Você está indo muito bem, continue assim!",
  "Hora de levantar e dar uma espreguiçada!",
  "Lembre-se: pausas aumentam a produtividade!",
];

// === Funções do Timer ===

// Atualiza o tempo no display
function atualizarDisplay() {
  const minutos = Math.floor(tempo / 60).toString().padStart(2, '0');
  const segundos = (tempo % 60).toString().padStart(2, '0');
  display.textContent = `${minutos}:${segundos}`;
}

// Atualiza o título da sessão atual
function atualizarTitulo() {
  titulo.textContent = emPausa ? "Tempo de Descanso" : "Tempo de Estudo";
}

// Inicia o timer
function iniciarTimer() {
  if (!intervalo) {
    tempoEstudo = parseFloat(inputEstudo.value) * 60;
    tempoPausa = parseFloat(inputPausa.value) * 60;

    if (tempo <= 0) {
      tempo = emPausa ? tempoPausa : tempoEstudo;
      atualizarTitulo();
    }

    intervalo = setInterval(() => {
      if (tempo > 0) {
        tempo--;
        atualizarDisplay();
      } else {
        clearInterval(intervalo);
        intervalo = null;
        emPausa = !emPausa;
        exibirDica();
        tocarSom();
        tempo = emPausa ? tempoPausa : tempoEstudo;
        atualizarTitulo();
        atualizarDisplay();
      }
    }, 1000);
  }
}

// Pausa o timer
function pausarTimer() {
  clearInterval(intervalo);
  intervalo = null;
}

// Reinicia o timer
function reiniciarTimer() {
  tempoEstudo = parseFloat(inputEstudo.value) * 60;
  tempoPausa = parseFloat(inputPausa.value) * 60;
  tempo = tempoEstudo;
  emPausa = false;
  atualizarTitulo();
  atualizarDisplay();
  mensagem.textContent = '';
  clearInterval(intervalo);
  intervalo = null;
}

// Exibe uma dica motivacional aleatória
function exibirDica() {
  const dica = dicas[Math.floor(Math.random() * dicas.length)];
  mensagem.textContent = dica;
}

// Toca som ao final do ciclo
function tocarSom() {
  const beep = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
  beep.play();
}

// === Listeners dos Botões do Timer ===
document.getElementById('start').addEventListener('click', iniciarTimer);
document.getElementById('pause').addEventListener('click', pausarTimer);
document.getElementById('reset').addEventListener('click', reiniciarTimer);

// Inicializa o display ao carregar
reiniciarTimer();

// === Lista de Tarefas Personalizada ===
const inputItem = document.getElementById('itemInput');
const btnAdd = document.getElementById('addItem');
const lista = document.getElementById('listaItens');

// Adiciona item à lista
btnAdd.addEventListener('click', () => {
  const texto = inputItem.value.trim();

  if (texto !== '') {
    const li = document.createElement('li');
    li.textContent = texto;

    li.addEventListener('click', () => {
      lista.removeChild(li);
    });

    lista.appendChild(li);
    inputItem.value = '';
  }
});

// === Botão de Configurações ===
const btnConfig = document.getElementById('btnConfig');
const configContainer = document.querySelector('.config-container');

btnConfig.addEventListener('click', () => {
  configContainer.style.display = 
    configContainer.style.display === 'none' || configContainer.style.display === ''
      ? 'block'
      : 'none';
});
