// Web Audio API Workplace & Studio Sound Synthesizer
// Produces tactile office/workplace audio: mechanical keystrokes, Slack-style workspace woodblock knocks,
// desk bell / contract stamp chimes, and conference bridge connection tones.
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Tactile mechanical keyboard switch clack (hover / tab switch / toggle)
  playTick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Short mechanical switch transient burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.014);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1850, now);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.014);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(now);

      // 2. Low keycap "thock" body resonance
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.022);
      oscGain.gain.setValueAtTime(0.06, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.024);
    } catch (e) {
      // Ignore audio failure
    }
  }

  // Crisp Slack/Workspace double-knock notification ping (selecting employee, opening Resume, action click)
  playPop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Two-tone woody workspace knock (G5 -> D6)
      const notes = [
        { freq: 783.99, offset: 0, duration: 0.055 },
        { freq: 1174.66, offset: 0.05, duration: 0.085 },
      ];

      notes.forEach(({ freq, offset, duration }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.04, now + offset + duration);

        gain.gain.setValueAtTime(0.11, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + offset);
        osc.stop(now + offset + duration + 0.01);
      });
    } catch (e) {
      // Ignore audio failure
    }
  }

  // Workplace Contract Stamp + Desk Service Bell (hiring an employee or reserving a workshop)
  playHireChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Tactile paper stamp thud
      const stampOsc = this.ctx.createOscillator();
      const stampGain = this.ctx.createGain();
      stampOsc.type = 'sine';
      stampOsc.frequency.setValueAtTime(160, now);
      stampOsc.frequency.exponentialRampToValueAtTime(48, now + 0.065);
      stampGain.gain.setValueAtTime(0.18, now);
      stampGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      stampOsc.connect(stampGain);
      stampGain.connect(this.ctx.destination);
      stampOsc.start(now);
      stampOsc.stop(now + 0.07);

      // 2. Crisp executive desk bell / badge scan two-note chime (A5 -> E6)
      const bellNotes = [
        { freq: 880, delay: 0.06, dur: 0.28 },
        { freq: 1318.51, delay: 0.14, dur: 0.45 },
      ];
      bellNotes.forEach(({ freq, delay, dur }) => {
        const osc = this.ctx!.createOscillator();
        const overtone = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        overtone.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);
        overtone.frequency.setValueAtTime(freq * 2, now + delay);

        gain.gain.setValueAtTime(0.1, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + delay);
        overtone.start(now + delay);
        osc.stop(now + delay + dur);
        overtone.stop(now + delay + dur);
      });
    } catch (e) {
      // Ignore audio failure
    }
  }

  // Conference Bridge / Workflow Task Completed Chime
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [587.33, 880, 1174.66]; // D5 -> A5 -> D6 crisp workplace task-complete tone
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.055;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.26);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch (e) {
      // Ignore audio failure
    }
  }
}

export const soundFx = new SoundController();
