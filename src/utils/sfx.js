// Web Audio API Sound Effects Generator
let ctx = null;

function initCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function osc(type, freq, freqEnd, dur, vol = 0.15) {
  try {
    initCtx();
    const t = ctx.currentTime;
    const oscNode = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscNode.type = type;
    oscNode.frequency.setValueAtTime(freq, t);
    if (freqEnd !== freq) {
      oscNode.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    }
    
    gainNode.gain.setValueAtTime(vol, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + dur);
    
    oscNode.connect(gainNode).connect(ctx.destination);
    oscNode.start(t);
    oscNode.stop(t + dur);
  } catch (e) {
    console.warn("SFX failed to play:", e);
  }
}

export const sfx = {
  click() {
    osc('sine', 600, 300, 0.08, 0.05);
  },
  
  correct() {
    try {
      initCtx();
      const t = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const oscNode = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscNode.type = 'sine';
        oscNode.frequency.setValueAtTime(f, t + i * 0.08);
        gainNode.gain.setValueAtTime(0.06, t + i * 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15);
        oscNode.connect(gainNode).connect(ctx.destination);
        oscNode.start(t + i * 0.08);
        oscNode.stop(t + i * 0.08 + 0.15);
      });
    } catch(e){}
  },

  incorrect() {
    osc('sawtooth', 180, 110, 0.25, 0.08);
  },

  match() {
    try {
      initCtx();
      const t = ctx.currentTime;
      [392, 587.33].forEach((f, i) => {
        const oscNode = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscNode.type = 'triangle';
        oscNode.frequency.setValueAtTime(f, t + i * 0.06);
        gainNode.gain.setValueAtTime(0.08, t + i * 0.06);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.12);
        oscNode.connect(gainNode).connect(ctx.destination);
        oscNode.start(t + i * 0.06);
        oscNode.stop(t + i * 0.06 + 0.12);
      });
    } catch(e){}
  },

  heartCatch() {
    osc('sine', 880, 1320, 0.12, 0.06);
  },

  victory() {
    try {
      initCtx();
      const t = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        const oscNode = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscNode.type = 'sine';
        oscNode.frequency.setValueAtTime(f, t + i * 0.1);
        gainNode.gain.setValueAtTime(0.08, t + i * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.3);
        oscNode.connect(gainNode).connect(ctx.destination);
        oscNode.start(t + i * 0.1);
        oscNode.stop(t + i * 0.1 + 0.3);
      });
    } catch(e){}
  }
};
