/* ============================
   BEEP SOUND
   ============================ */
let beepCtx = null;

function ensureBeepCtx() {
  if (!beepCtx || beepCtx.state === 'closed') {
    try {
      beepCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {}
  }
  if (beepCtx && beepCtx.state === 'suspended') {
    beepCtx.resume().catch(() => {});
  }
}

function playSound() {
  ensureBeepCtx();
  if (!beepCtx) return;
  try {
    const osc = beepCtx.createOscillator();
    const gain = beepCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, beepCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, beepCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(beepCtx.destination);
    osc.start();
    osc.stop(beepCtx.currentTime + 0.3);
  } catch (_) {}
}

/* ============================
   AMBIENT SOUND (Web Audio API)
   ============================ */
let ambientCtx = null;
let ambientGain = null;
let ambientNodes = [];

function createNoiseBuffer(ctx) {
  const sr = ctx.sampleRate;
  const len = sr * 4;
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function playAmbient(type) {
  stopAmbient();
  if (type === 'none') return;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ambientCtx = ctx;

    const masterGain = ctx.createGain();
    const vol = parseFloat($('#ambientVolume').value) / 100;
    masterGain.gain.value = vol * 0.3;
    masterGain.connect(ctx.destination);
    ambientGain = masterGain;

    const buf = createNoiseBuffer(ctx);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const filters = [];

    switch (type) {
      case 'white':
        src.connect(masterGain);
        break;

      case 'pink': {
        const f1 = ctx.createBiquadFilter();
        f1.type = 'lowpass'; f1.frequency.value = 2000;
        const f2 = ctx.createBiquadFilter();
        f2.type = 'lowpass'; f2.frequency.value = 500;
        src.connect(f1); f1.connect(f2); f2.connect(masterGain);
        filters.push(f1, f2);
        break;
      }

      case 'brown': {
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass'; f.frequency.value = 200;
        src.connect(f); f.connect(masterGain);
        filters.push(f);
        break;
      }

      case 'rain': {
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass'; f.frequency.value = 800;
        src.connect(f); f.connect(masterGain);
        filters.push(f);
        break;
      }

      case 'forest': {
        const f = ctx.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 0.8;
        src.connect(f); f.connect(masterGain);
        filters.push(f);
        break;
      }

      case 'hz852': {
        const vol = parseFloat($('#ambientVolume').value) / 100;
        const osc = ctx.createOscillator();
        osc.type = 'sine'; osc.frequency.value = 852;
        const oscGain = ctx.createGain();
        oscGain.gain.value = vol * 0.4;
        osc.connect(oscGain); oscGain.connect(masterGain);
        osc.start();
        ambientNodes.push(osc, oscGain);
        src.stop();
        break;
      }

      default:
        src.connect(masterGain);
    }

    src.start();
    ambientNodes = [src, ...filters];
    state.ambientType = type;
  } catch (_) {}
}

function stopAmbient() {
  if (ambientCtx) {
    ambientCtx.close().catch(() => {});
    ambientCtx = null;
    ambientGain = null;
    ambientNodes = [];
  }
  state.ambientType = 'none';
}

function setAmbient(type) {
  ambientBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ambient === type);
  });
  if (type === 'none') {
    stopAmbient();
  } else {
    playAmbient(type);
  }
}

ambientBtns.forEach(btn => {
  btn.addEventListener('click', () => setAmbient(btn.dataset.ambient));
});

$('#ambientVolume').addEventListener('input', (e) => {
  const vol = parseFloat(e.target.value) / 100;
  if (ambientGain) {
    ambientGain.gain.setTargetAtTime(vol * 0.3, ambientCtx.currentTime, 0.1);
  }
});
