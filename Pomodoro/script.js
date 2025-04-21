let tempo = 25 * 60; // 25 minutos
let intervalo;
const display = document.getElementById('timer');
const mensagem = document.getElementById('mensagem');

const dicas = [
  "💡 Elimine distrações antes de começar.",
  "💡 Estude sempre no mesmo horário para criar hábito.",
  "💡 Divida tarefas grandes em pequenas etapas.",
  "💡 Use a técnica Feynman para revisar o que aprendeu.",
  "💡 Faça pausas longe de telas, respire fundo.",
  "💡 Planeje o seu dia com antecedência."
];

function atualizarDisplay() {
  const minutos = Math.floor(tempo / 60).toString().padStart(2, '0');
  const segundos = (tempo % 60).toString().padStart(2, '0');
  display.textContent = `${minutos}:${segundos}`;
}

function iniciarTimer() {
  if (!intervalo) {
    intervalo = setInterval(() => {
      if (tempo > 0) {
        tempo--;
        atualizarDisplay();
      } else {
        clearInterval(intervalo);
        intervalo = null;
        exibirDica();
        tocarSom();
      }
    }, 1000);
  }
}

function pausarTimer() {
  clearInterval(intervalo);
  intervalo = null;
}

function reiniciarTimer() {
  tempo = 25 * 60;
  atualizarDisplay();
  mensagem.textContent = "";
  clearInterval(intervalo);
  intervalo = null;
}

function exibirDica() {
  const dica = dicas[Math.floor(Math.random() * dicas.length)];
  mensagem.textContent = dica;
}

function tocarSom() {
  const beep = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
  beep.play();
}

document.getElementById('start').addEventListener('click', iniciarTimer);
document.getElementById('pause').addEventListener('click', pausarTimer);
document.getElementById('reset').addEventListener('click', reiniciarTimer);

atualizarDisplay();
