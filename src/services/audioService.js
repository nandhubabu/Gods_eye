/**
 * God's Eye Tactical Synthesized Audio Service
 * Uses Web Audio API to create authentic military/aerospace C2 sounds
 * without needing external audio files.
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    _initCtx() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this._initCtx();
            this.playBeep(880, 0.05);
        }
        return this.enabled;
    }

    /**
     * Subtle UI click/tap
     */
    playBeep(freq = 1200, duration = 0.04) {
        if (!this.enabled) return;
        try {
            this._initCtx();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (_) {}
    }

    /**
     * Tactical target lock-on chirps
     */
    playTargetLock() {
        if (!this.enabled) return;
        try {
            this._initCtx();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            // Dual-tone chirp
            [1480, 1960].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);

                gain.gain.setValueAtTime(0.04, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.05);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.05);
            });
        } catch (_) {}
    }

    /**
     * Ambient Radar sweep ping
     */
    playRadarSweep() {
        if (!this.enabled) return;
        try {
            this._initCtx();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(260, now + 0.35);

            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch (_) {}
    }

    /**
     * Alert warning chime
     */
    playAlert() {
        if (!this.enabled) return;
        try {
            this._initCtx();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.1);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (_) {}
    }
}

export const audio = new AudioEngine();
