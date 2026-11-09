/**
 * Rapido-Style Real-Time Rain Alarm Audio Synthesizer
 * 
 * Generates an attention-grabbing, unmistakable 5-second dual-tone alert siren
 * using standard Web Audio API. 
 * - Zero external MP3/WAV dependencies (cannot 404 or fail on slow 2G/3G mobile networks).
 * - Guaranteed exact 5.0s playback duration.
 * - Accompanied by mobile haptic vibration pattern.
 * - Handles browser Autoplay/AudioContext unlock policies cleanly.
 */

export interface RainAlarmSettings {
  enabled: boolean;
  volume: number; // 0.1 to 1.0
}

class RainAlarmPlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private activeGainNode: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private countdownTimer: any = null;
  private lastAlertIdFired: string = '';

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser policy
  }

  /**
   * Initializes or resumes the AudioContext upon user gesture.
   */
  public async unlockAudio(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return false;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      // Play a short silent buffer to firmly unlock mobile iOS/Android audio pipeline
      const buffer = this.audioCtx.createBuffer(1, 1, 22050);
      const source = this.audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioCtx.destination);
      source.start(0);

      return true;
    } catch (e) {
      console.warn('AudioContext unlock failed:', e);
      return false;
    }
  }

  /**
   * Play the 5-second Rapido-style alert siren.
   * Alternating high-urgency dual-frequency pulses: 880 Hz (A5) and 1320 Hz (E6).
   */
  public async playAlarm(
    volume: number = 0.8,
    onCountdown?: (secondsLeft: number) => void,
    onEnded?: () => void
  ): Promise<boolean> {
    if (this.isPlaying) {
      this.stopAlarm();
    }

    const unlocked = await this.unlockAudio();
    if (!unlocked || !this.audioCtx) {
      console.warn('Cannot play alarm: AudioContext not unlocked.');
      return false;
    }

    try {
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.isPlaying = true;
      const ctx = this.audioCtx;
      const startTime = ctx.currentTime + 0.05;
      const totalDuration = 5.0; // Exactly 5.0 seconds

      // Master gain node
      const masterGain = ctx.createGain();
      const safeVolume = Math.max(0.1, Math.min(1.0, volume));
      masterGain.gain.setValueAtTime(safeVolume, startTime);
      masterGain.connect(ctx.destination);
      this.activeGainNode = masterGain;

      // Haptic vibration on mobile devices (repeating pulse pattern matching audio)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([250, 100, 250, 100, 400, 150, 250, 100, 400, 150, 500]);
        } catch (e) {}
      }

      // Generate pulsed chime sequence (Rapido Captain alert cadence: high chirp, low chirp, pulse)
      // Cycle duration ~0.5s -> 10 cycles in 5.0 seconds
      const cycleLength = 0.5;
      const cycles = Math.floor(totalDuration / cycleLength);

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth'; // rich penetrating harmonic tone for noisy outdoors
      oscGain.gain.setValueAtTime(0, startTime);

      for (let i = 0; i < cycles; i++) {
        const cycleStart = startTime + i * cycleLength;
        // Tone 1: 880 Hz (A5)
        osc.frequency.setValueAtTime(880, cycleStart);
        oscGain.gain.setValueAtTime(0, cycleStart);
        oscGain.gain.linearRampToValueAtTime(0.4, cycleStart + 0.03);
        oscGain.gain.exponentialRampToValueAtTime(0.01, cycleStart + 0.20);

        // Tone 2: 1320 Hz (E6 - high attention frequency)
        const tone2Start = cycleStart + 0.22;
        osc.frequency.setValueAtTime(1320, tone2Start);
        oscGain.gain.setValueAtTime(0.01, tone2Start);
        oscGain.gain.linearRampToValueAtTime(0.45, tone2Start + 0.03);
        oscGain.gain.exponentialRampToValueAtTime(0.001, tone2Start + 0.24);
      }

      // Second harmonic oscillator for fullness and acoustic power
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subGain.gain.setValueAtTime(0, startTime);

      for (let i = 0; i < cycles; i++) {
        const cycleStart = startTime + i * cycleLength;
        subOsc.frequency.setValueAtTime(440, cycleStart);
        subGain.gain.setValueAtTime(0, cycleStart);
        subGain.gain.linearRampToValueAtTime(0.3, cycleStart + 0.04);
        subGain.gain.exponentialRampToValueAtTime(0.01, cycleStart + 0.45);
      }

      // Connect nodes
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      subOsc.connect(subGain);
      subGain.connect(masterGain);

      this.activeOscillators = [osc, subOsc];

      // Schedule start & stop
      osc.start(startTime);
      subOsc.start(startTime);

      const endTime = startTime + totalDuration;
      masterGain.gain.setValueAtTime(safeVolume, endTime - 0.1);
      masterGain.gain.linearRampToValueAtTime(0.0001, endTime);

      osc.stop(endTime);
      subOsc.stop(endTime);

      // Countdown ticker for UI display (5s down to 0s)
      let secondsRemaining = 5;
      if (onCountdown) onCountdown(secondsRemaining);

      this.countdownTimer = setInterval(() => {
        secondsRemaining -= 1;
        if (secondsRemaining > 0) {
          if (onCountdown) onCountdown(secondsRemaining);
        } else {
          this.stopAlarm();
          if (onCountdown) onCountdown(0);
          if (onEnded) onEnded();
        }
      }, 1000);

      osc.onended = () => {
        if (this.isPlaying) {
          this.stopAlarm();
          if (onCountdown) onCountdown(0);
          if (onEnded) onEnded();
        }
      };

      return true;
    } catch (err) {
      console.error('Error playing rain alarm:', err);
      this.stopAlarm();
      return false;
    }
  }

  /**
   * Stop the active alarm sound immediately.
   */
  public stopAlarm(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    if (this.activeOscillators.length > 0) {
      for (const osc of this.activeOscillators) {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      }
      this.activeOscillators = [];
    }

    if (this.activeGainNode) {
      try {
        this.activeGainNode.disconnect();
      } catch (e) {}
      this.activeGainNode = null;
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch (e) {}
    }

    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Check if this alert should trigger an alarm with strict evidence and deduplication.
   * Prevents playing on initial load, refresh, dry weather, or previously alarmed events.
   */
  public shouldTriggerForAlert(
    alertLevel: string,
    eventId: string,
    observationTimeIso?: string,
    isInitialLoad: boolean = false
  ): boolean {
    // 1. Only verified warning levels (YELLOW, ORANGE, RED) can ever sound an alarm
    if (!['YELLOW', 'ORANGE', 'RED'].includes(alertLevel)) {
      return false;
    }

    // 2. NEVER play on initial website open or page refresh
    if (isInitialLoad) {
      if (typeof window !== 'undefined' && eventId) {
        try {
          localStorage.setItem('raithu_last_alarmed_event_id', eventId);
        } catch (e) {}
      }
      return false;
    }

    if (!eventId) {
      return false;
    }

    // 3. Reject stale events (> 30 minutes old)
    if (observationTimeIso) {
      const obsTime = new Date(observationTimeIso).getTime();
      if (!isNaN(obsTime) && Date.now() - obsTime > 30 * 60 * 1000) {
        return false;
      }
    }

    // 4. Persistent deduplication via localStorage:
    // Prevents duplicate alarms across reloads, tab switches, and background syncs
    if (typeof window !== 'undefined') {
      try {
        const lastFired = localStorage.getItem('raithu_last_alarmed_event_id');
        if (lastFired === eventId) {
          return false; // Already alarmed for this exact event!
        }
      } catch (e) {}
    }

    if (this.lastAlertIdFired === eventId) {
      return false;
    }

    // 5. Genuine, verified new rain-approaching event!
    this.lastAlertIdFired = eventId;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('raithu_last_alarmed_event_id', eventId);
      } catch (e) {}
    }
    return true;
  }

  public resetLastAlertKey(): void {
    this.lastAlertIdFired = '';
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('raithu_last_alarmed_event_id');
      } catch (e) {}
    }
  }
}

export const rainAlarmPlayer = new RainAlarmPlayer();
