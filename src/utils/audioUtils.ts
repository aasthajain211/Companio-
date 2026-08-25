// Web Audio API and Speech Synthesis Helpers for Companio Elder Care

class SoundEffectsManager {
  private ctx: AudioContext | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Gentle Pleasant Temple / Bell Chime for routine reminders
  playChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord chime

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 1.8);
    });
  }

  // Pure Musical Temple Bell for Simon Says Color Memory
  playBellNote(freq = 523.25, duration = 1.4) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Primary Tone + Harmonic Ring
    const harmonics = [1, 2.76, 5.4, 8.93];
    const amplitudes = [0.35, 0.12, 0.06, 0.02];

    harmonics.forEach((h, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * h, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(amplitudes[idx], now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + duration / (idx + 1));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // Gentle Error/Retry Sound
  playRetryTone() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.35);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Uplifting Success Chime
  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 1.3);
    });
  }

  // Loud Emergency SOS Siren Sound
  playSiren(durationSeconds = 4): () => void {
    const ctx = this.getContext();
    if (!ctx) return () => {};

    let isPlaying = true;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);

    // Siren sweep between 600Hz and 1200Hz
    const now = ctx.currentTime;
    for (let t = 0; t < durationSeconds; t += 0.5) {
      osc.frequency.linearRampToValueAtTime(1100, now + t + 0.25);
      osc.frequency.linearRampToValueAtTime(600, now + t + 0.5);
    }

    gain.gain.setValueAtTime(0.35, now);
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    const stopTime = now + durationSeconds;
    osc.stop(stopTime);

    return () => {
      if (isPlaying) {
        try {
          osc.stop();
          gain.disconnect();
        } catch (e) {
          // ignore already stopped
        }
        isPlaying = false;
      }
    };
  }

  // Calming Indian Flute / Tanpura frequency drone
  playCalmingTone(durationSec = 5) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 432; // 432 Hz healing natural tuning

    [baseFreq, baseFreq * 1.5, baseFreq * 2].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1 / (idx + 1), now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec + 0.2);
    });
  }
}

export const soundFx = new SoundEffectsManager();

// Full Musical Melody Synthesizer for Authentic Indian Retro Classics
// Plays actual note melodies with rich instrument envelopes (Flute, Sitar, Santoor, Tanpura)
export interface MelodyNote {
  freq: number;
  dur: number; // in seconds
  lyricIdx?: number;
}

// Frequency helpers
const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99,
  G4: 392.00, Gs4: 415.30, A4: 440.00, As4: 466.16, B4: 493.88,
  C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99,
  G5: 783.99, Gs5: 830.61, A5: 880.00, As5: 932.33, B5: 987.77,
  C6: 1046.50, REST: 0
};

// Song Melodies definition
export const CLASSIC_MELODIES: Record<string, { tempo: number; instrument: 'flute' | 'sitar' | 'santoor' | 'harmonium'; notes: MelodyNote[] }> = {
  // 1. Yeh Shaam Mastani (Kishore Kumar - Kati Patang)
  s1: {
    tempo: 108,
    instrument: 'flute',
    notes: [
      { freq: N.D4, dur: 0.6, lyricIdx: 0 },
      { freq: N.G4, dur: 0.6, lyricIdx: 0 },
      { freq: N.A4, dur: 0.6, lyricIdx: 0 },
      { freq: N.B4, dur: 0.9, lyricIdx: 0 },
      { freq: N.A4, dur: 0.4, lyricIdx: 0 },
      { freq: N.G4, dur: 0.6, lyricIdx: 0 },
      { freq: N.Fs4, dur: 0.6, lyricIdx: 0 },
      { freq: N.G4, dur: 1.2, lyricIdx: 0 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.A4, dur: 0.5, lyricIdx: 1 },
      { freq: N.B4, dur: 0.5, lyricIdx: 1 },
      { freq: N.C5, dur: 0.8, lyricIdx: 1 },
      { freq: N.B4, dur: 0.5, lyricIdx: 1 },
      { freq: N.A4, dur: 0.5, lyricIdx: 1 },
      { freq: N.G4, dur: 0.5, lyricIdx: 1 },
      { freq: N.Fs4, dur: 0.5, lyricIdx: 1 },
      { freq: N.G4, dur: 1.4, lyricIdx: 1 },
      { freq: N.REST, dur: 0.4 },
      // Antara
      { freq: N.D5, dur: 0.7, lyricIdx: 2 },
      { freq: N.D5, dur: 0.7, lyricIdx: 2 },
      { freq: N.C5, dur: 0.5, lyricIdx: 2 },
      { freq: N.B4, dur: 0.6, lyricIdx: 2 },
      { freq: N.C5, dur: 0.6, lyricIdx: 2 },
      { freq: N.D5, dur: 1.2, lyricIdx: 2 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.E5, dur: 0.7, lyricIdx: 3 },
      { freq: N.D5, dur: 0.5, lyricIdx: 3 },
      { freq: N.C5, dur: 0.5, lyricIdx: 3 },
      { freq: N.B4, dur: 0.6, lyricIdx: 3 },
      { freq: N.A4, dur: 0.6, lyricIdx: 3 },
      { freq: N.G4, dur: 1.5, lyricIdx: 3 }
    ]
  },

  // 2. Lag Ja Gale (Lata Mangeshkar - Woh Kaun Thi)
  s2: {
    tempo: 82,
    instrument: 'santoor',
    notes: [
      { freq: N.G4, dur: 0.8, lyricIdx: 0 },
      { freq: N.Gs4, dur: 0.6, lyricIdx: 0 },
      { freq: N.G4, dur: 0.6, lyricIdx: 0 },
      { freq: N.F4, dur: 0.6, lyricIdx: 0 },
      { freq: N.Ds4, dur: 0.8, lyricIdx: 0 },
      { freq: N.D4, dur: 0.6, lyricIdx: 0 },
      { freq: N.C4, dur: 1.4, lyricIdx: 0 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.D4, dur: 0.6, lyricIdx: 1 },
      { freq: N.Ds4, dur: 0.6, lyricIdx: 1 },
      { freq: N.F4, dur: 0.8, lyricIdx: 1 },
      { freq: N.G4, dur: 0.8, lyricIdx: 1 },
      { freq: N.Ds4, dur: 0.6, lyricIdx: 1 },
      { freq: N.D4, dur: 0.6, lyricIdx: 1 },
      { freq: N.C4, dur: 1.5, lyricIdx: 1 },
      { freq: N.REST, dur: 0.4 },
      // Antara
      { freq: N.C5, dur: 0.8, lyricIdx: 2 },
      { freq: N.As4, dur: 0.6, lyricIdx: 2 },
      { freq: N.Gs4, dur: 0.8, lyricIdx: 2 },
      { freq: N.G4, dur: 1.2, lyricIdx: 2 },
      { freq: N.F4, dur: 0.6, lyricIdx: 3 },
      { freq: N.Gs4, dur: 0.6, lyricIdx: 3 },
      { freq: N.G4, dur: 0.6, lyricIdx: 3 },
      { freq: N.F4, dur: 0.6, lyricIdx: 3 },
      { freq: N.Ds4, dur: 0.6, lyricIdx: 3 },
      { freq: N.D4, dur: 0.6, lyricIdx: 3 },
      { freq: N.C4, dur: 1.8, lyricIdx: 3 }
    ]
  },

  // 3. Achyutam Keshavam Krishna Damodaram (Bhajan)
  s3: {
    tempo: 90,
    instrument: 'flute',
    notes: [
      { freq: N.E4, dur: 0.6, lyricIdx: 0 },
      { freq: N.G4, dur: 0.6, lyricIdx: 0 },
      { freq: N.A4, dur: 0.8, lyricIdx: 0 },
      { freq: N.C5, dur: 0.8, lyricIdx: 0 },
      { freq: N.B4, dur: 0.5, lyricIdx: 0 },
      { freq: N.A4, dur: 0.5, lyricIdx: 0 },
      { freq: N.G4, dur: 1.2, lyricIdx: 0 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.A4, dur: 0.6, lyricIdx: 1 },
      { freq: N.G4, dur: 0.5, lyricIdx: 1 },
      { freq: N.E4, dur: 0.5, lyricIdx: 1 },
      { freq: N.D4, dur: 0.6, lyricIdx: 1 },
      { freq: N.C4, dur: 1.5, lyricIdx: 1 },
      { freq: N.REST, dur: 0.4 },
      // Kaun Kehte hain bhagwan aate nahi
      { freq: N.G4, dur: 0.7, lyricIdx: 2 },
      { freq: N.C5, dur: 0.7, lyricIdx: 2 },
      { freq: N.C5, dur: 0.8, lyricIdx: 2 },
      { freq: N.D5, dur: 0.6, lyricIdx: 2 },
      { freq: N.C5, dur: 0.6, lyricIdx: 2 },
      { freq: N.B4, dur: 0.6, lyricIdx: 2 },
      { freq: N.A4, dur: 1.2, lyricIdx: 2 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.B4, dur: 0.6, lyricIdx: 3 },
      { freq: N.A4, dur: 0.5, lyricIdx: 3 },
      { freq: N.G4, dur: 0.6, lyricIdx: 3 },
      { freq: N.E4, dur: 0.6, lyricIdx: 3 },
      { freq: N.D4, dur: 0.6, lyricIdx: 3 },
      { freq: N.C4, dur: 1.8, lyricIdx: 3 }
    ]
  },

  // 4. Babu Moshai - Zindagi Kaisi Hai Paheli (Anand 1971)
  s4: {
    tempo: 96,
    instrument: 'sitar',
    notes: [
      { freq: N.C4, dur: 0.5, lyricIdx: 0 },
      { freq: N.F4, dur: 0.7, lyricIdx: 0 },
      { freq: N.A4, dur: 0.7, lyricIdx: 0 },
      { freq: N.C5, dur: 0.8, lyricIdx: 0 },
      { freq: N.As4, dur: 0.5, lyricIdx: 0 },
      { freq: N.A4, dur: 0.5, lyricIdx: 0 },
      { freq: N.G4, dur: 1.3, lyricIdx: 0 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.G4, dur: 0.5, lyricIdx: 1 },
      { freq: N.A4, dur: 0.5, lyricIdx: 1 },
      { freq: N.As4, dur: 0.6, lyricIdx: 1 },
      { freq: N.A4, dur: 0.5, lyricIdx: 1 },
      { freq: N.G4, dur: 0.5, lyricIdx: 1 },
      { freq: N.F4, dur: 1.4, lyricIdx: 1 },
      { freq: N.REST, dur: 0.4 },
      // Kabhi toh hasaye kabhi ye rulaye
      { freq: N.C5, dur: 0.6, lyricIdx: 2 },
      { freq: N.C5, dur: 0.6, lyricIdx: 2 },
      { freq: N.D5, dur: 0.7, lyricIdx: 2 },
      { freq: N.C5, dur: 0.5, lyricIdx: 2 },
      { freq: N.As4, dur: 0.6, lyricIdx: 2 },
      { freq: N.A4, dur: 1.2, lyricIdx: 2 },
      { freq: N.REST, dur: 0.2 },
      { freq: N.G4, dur: 0.6, lyricIdx: 3 },
      { freq: N.A4, dur: 0.6, lyricIdx: 3 },
      { freq: N.As4, dur: 0.5, lyricIdx: 3 },
      { freq: N.A4, dur: 0.5, lyricIdx: 3 },
      { freq: N.G4, dur: 0.5, lyricIdx: 3 },
      { freq: N.F4, dur: 1.6, lyricIdx: 3 }
    ]
  },

  // 5. Raghupati Raghav Raja Ram (Santoor & Sitar Dhun)
  s5: {
    tempo: 84,
    instrument: 'santoor',
    notes: [
      { freq: N.C4, dur: 0.6, lyricIdx: 0 },
      { freq: N.D4, dur: 0.6, lyricIdx: 0 },
      { freq: N.E4, dur: 0.7, lyricIdx: 0 },
      { freq: N.G4, dur: 0.9, lyricIdx: 0 },
      { freq: N.A4, dur: 0.6, lyricIdx: 0 },
      { freq: N.G4, dur: 0.6, lyricIdx: 0 },
      { freq: N.E4, dur: 0.6, lyricIdx: 0 },
      { freq: N.D4, dur: 0.6, lyricIdx: 0 },
      { freq: N.C4, dur: 1.4, lyricIdx: 0 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.E4, dur: 0.6, lyricIdx: 1 },
      { freq: N.G4, dur: 0.7, lyricIdx: 1 },
      { freq: N.A4, dur: 0.8, lyricIdx: 1 },
      { freq: N.G4, dur: 0.6, lyricIdx: 1 },
      { freq: N.E4, dur: 0.6, lyricIdx: 1 },
      { freq: N.D4, dur: 0.6, lyricIdx: 1 },
      { freq: N.C4, dur: 1.6, lyricIdx: 1 },
      { freq: N.REST, dur: 0.4 },
      // Ishwar Allah tero naam
      { freq: N.G4, dur: 0.7, lyricIdx: 2 },
      { freq: N.C5, dur: 0.8, lyricIdx: 2 },
      { freq: N.C5, dur: 0.8, lyricIdx: 2 },
      { freq: N.B4, dur: 0.6, lyricIdx: 2 },
      { freq: N.A4, dur: 0.6, lyricIdx: 2 },
      { freq: N.G4, dur: 1.2, lyricIdx: 2 },
      { freq: N.REST, dur: 0.2 },
      { freq: N.A4, dur: 0.6, lyricIdx: 3 },
      { freq: N.G4, dur: 0.6, lyricIdx: 3 },
      { freq: N.E4, dur: 0.6, lyricIdx: 3 },
      { freq: N.D4, dur: 0.6, lyricIdx: 3 },
      { freq: N.C4, dur: 1.8, lyricIdx: 3 }
    ]
  },

  // 6. Chura Liya Hai Tumne Jo Dil Ko (1973 Romance)
  s6: {
    tempo: 104,
    instrument: 'flute',
    notes: [
      { freq: N.E4, dur: 0.5, lyricIdx: 0 },
      { freq: N.A4, dur: 0.6, lyricIdx: 0 },
      { freq: N.B4, dur: 0.6, lyricIdx: 0 },
      { freq: N.C5, dur: 0.8, lyricIdx: 0 },
      { freq: N.B4, dur: 0.5, lyricIdx: 0 },
      { freq: N.A4, dur: 0.6, lyricIdx: 0 },
      { freq: N.Gs4, dur: 0.6, lyricIdx: 0 },
      { freq: N.A4, dur: 1.2, lyricIdx: 0 },
      { freq: N.REST, dur: 0.3 },
      { freq: N.B4, dur: 0.5, lyricIdx: 1 },
      { freq: N.C5, dur: 0.5, lyricIdx: 1 },
      { freq: N.D5, dur: 0.7, lyricIdx: 1 },
      { freq: N.C5, dur: 0.5, lyricIdx: 1 },
      { freq: N.B4, dur: 0.5, lyricIdx: 1 },
      { freq: N.A4, dur: 1.4, lyricIdx: 1 },
      { freq: N.REST, dur: 0.3 },
      // Nazar nahi churana sanam
      { freq: N.E5, dur: 0.7, lyricIdx: 2 },
      { freq: N.D5, dur: 0.6, lyricIdx: 2 },
      { freq: N.C5, dur: 0.6, lyricIdx: 2 },
      { freq: N.B4, dur: 0.6, lyricIdx: 2 },
      { freq: N.C5, dur: 0.6, lyricIdx: 2 },
      { freq: N.A4, dur: 1.3, lyricIdx: 2 }
    ]
  }
};

export class MelodyPlayer {
  private ctx: AudioContext | null = null;
  private currentTimeout: any = null;
  private isPlaying = false;
  private currentNoteIndex = 0;
  private loop = true;
  private volume = 0.8;
  private onProgressCb?: (pct: number, lyricIdx?: number) => void;
  private songId = '';

  constructor() {
    // Lazy initialized
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playSong(songId: string, onProgress?: (pct: number, lyricIdx?: number) => void) {
    this.stop();
    this.songId = songId;
    this.onProgressCb = onProgress;
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.scheduleNextNote();
  }

  private scheduleNextNote() {
    if (!this.isPlaying) return;
    const melodyData = CLASSIC_MELODIES[this.songId] || CLASSIC_MELODIES.s1;
    const notes = melodyData.notes;

    if (this.currentNoteIndex >= notes.length) {
      if (this.loop) {
        this.currentNoteIndex = 0;
      } else {
        this.stop();
        return;
      }
    }

    const note = notes[this.currentNoteIndex];
    const duration = note.dur;

    // Report progress percentage
    const pct = Math.round((this.currentNoteIndex / notes.length) * 100);
    if (this.onProgressCb) {
      this.onProgressCb(pct, note.lyricIdx);
    }

    // Play note if not rest
    if (note.freq > 0) {
      this.playInstrumentTone(note.freq, duration, melodyData.instrument);
    }

    this.currentNoteIndex++;
    this.currentTimeout = setTimeout(() => {
      this.scheduleNextNote();
    }, duration * 1000);
  }

  private playInstrumentTone(freq: number, duration: number, instrument: string) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, now);
    masterGain.connect(ctx.destination);

    if (instrument === 'flute') {
      // Warm Sine + Breath harmonic
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.08); // soft breath attack
      gain1.gain.linearRampToValueAtTime(0.22, now + duration * 0.7);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.05, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(masterGain);
      gain2.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    } else if (instrument === 'santoor') {
      // Plucked string acoustic resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration * 1.3);
    } else {
      // Sitar / Harmonium harmonic blend
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.002, now); // slight chorus

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  public resume() {
    if (!this.isPlaying && this.songId) {
      this.isPlaying = true;
      this.scheduleNextNote();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentNoteIndex = 0;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const melodyPlayer = new MelodyPlayer();

// Text to Speech for Elder Voice Prompts
export function speakElderVoice(text: string, lang = 'hi-IN'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88; // Slower, clearer cadence for elderly ears
    utterance.pitch = 1.05;

    // Try to pick an Indian Hindi/English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Hindi')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
