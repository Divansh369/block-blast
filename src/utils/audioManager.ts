// A simple class to manage audio playback using the Web Audio API.
// This approach avoids needing to load external audio files.
class AudioManager {
  private audioCtx: AudioContext | null = null;
  private isEnabled = true;

  /**
   * Initializes the AudioContext. 
   * This must be called as a result of a user gesture (e.g., a click).
   */
  public init() {
    if (!this.audioCtx) {
      try {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser.");
      }
    }
  }

  /**
   * Sets whether sounds should be played.
   * @param {boolean} enabled - True to enable sounds, false to disable.
   */
  public setSoundEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * Plays a sound of a specific type.
   * @param {'place' | 'clear' | 'gameOver' | 'powerUpReady' | 'powerUpUse'} type - The type of sound to play.
   */
  public playSound(type: 'place' | 'clear' | 'gameOver' | 'powerUpReady' | 'powerUpUse') {
    if (!this.audioCtx || !this.isEnabled) return;
    
    // In some browsers, the AudioContext might be suspended until a user gesture.
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    switch (type) {
      case 'place':
        this.playPlaceSound();
        break;
      case 'clear':
        this.playClearSound();
        break;
      case 'gameOver':
        this.playGameOverSound();
        break;
      case 'powerUpReady':
        this.playPowerUpReadySound();
        break;
      case 'powerUpUse':
        this.playPowerUpUseSound();
        break;
    }
  }

  private playPlaceSound() {
    if (!this.audioCtx) return;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.start(this.audioCtx.currentTime);
    oscillator.stop(this.audioCtx.currentTime + 0.1);
  }

  private playClearSound() {
    if (!this.audioCtx) return;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.start(this.audioCtx.currentTime);
    oscillator.stop(this.audioCtx.currentTime + 0.2);
  }

  private playGameOverSound() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const notes = [261.63, 233.08, 207.65]; // C4, A#3, G#3
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    gainNode.connect(this.audioCtx.destination);

    notes.forEach((freq, i) => {
      const oscillator = this.audioCtx.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(freq, now + i * 0.2);
      oscillator.connect(gainNode);
      oscillator.start(now + i * 0.2);
      oscillator.stop(now + i * 0.2 + 0.15);
    });
  }

  private playPowerUpReadySound() {
    if (!this.audioCtx) return;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.start(this.audioCtx.currentTime);
    oscillator.stop(this.audioCtx.currentTime + 0.3);
  }

  private playPowerUpUseSound() {
    if (!this.audioCtx) return;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.start(this.audioCtx.currentTime);
    oscillator.stop(this.audioCtx.currentTime + 0.5);
  }
}

export const audioManager = new AudioManager();