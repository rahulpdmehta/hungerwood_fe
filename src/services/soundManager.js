/**
 * SoundManager - Centralized sound management for HungerWood
 * Handles all sound effects with user preferences and device respect
 */

import { Howl } from 'howler';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = this.loadSoundPreference();
    this.volume = 0.3; // Low volume by default
    this.initialized = false;
  }

  /**
   * Load sound preference from localStorage
   */
  loadSoundPreference() {
    try {
      const saved = localStorage.getItem('hungerwood_sounds_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  }

  /**
   * Save sound preference to localStorage
   */
  saveSoundPreference(enabled) {
    try {
      localStorage.setItem('hungerwood_sounds_enabled', JSON.stringify(enabled));
    } catch (error) {
      console.error('Failed to save sound preference:', error);
    }
  }

  /**
   * Initialize sound library with audio files
   */
  init() {
    if (this.initialized) return;

    // Define all sounds (only .mp3 files are available)
    this.sounds = {
      success: new Howl({
        src: ['/sounds/success.mp3'],
        volume: this.volume,
        preload: true,
      }),
      orderPlaced: new Howl({
        src: ['/sounds/order-placed.mp3'],
        volume: this.volume,
        preload: true,
      }),
      walletCredit: new Howl({
        src: ['/sounds/coin.mp3'],
        volume: this.volume,
        preload: true,
      }),
      addToCart: new Howl({
        src: ['/sounds/pop.mp3'],
        volume: this.volume * 0.8, // Quieter for frequent action
        preload: true,
      }),
      statusUpdate: new Howl({
        src: ['/sounds/notification.mp3'],
        volume: this.volume * 0.7,
        preload: true,
      }),
      reward: new Howl({
        src: ['/sounds/reward.mp3'],
        volume: this.volume,
        preload: true,
      }),
    };

    this.initialized = true;
    console.log('🔊 SoundManager initialized');
  }

  /**
   * Play a sound by name
   * @param {string} soundName - Name of the sound to play
   * @param {object} options - Additional options (volume override, etc.)
   */
  play(soundName, options = {}) {
    if (!this.enabled) {
      console.log(`🔇 Sound disabled: ${soundName}`);
      return;
    }

    if (!this.initialized) {
      this.init();
    }

    const sound = this.sounds[soundName];
    if (!sound) {
      console.warn(`⚠️ Sound not found: ${soundName}`);
      return;
    }

    // Apply volume override if provided
    if (options.volume !== undefined) {
      sound.volume(options.volume);
    }

    try {
      sound.play();
      console.log(`🔊 Playing sound: ${soundName}`);
    } catch (error) {
      console.error(`Failed to play sound: ${soundName}`, error);
    }
  }

  /**
   * Enable sounds
   */
  enable() {
    this.enabled = true;
    this.saveSoundPreference(true);
    console.log('🔊 Sounds enabled');
  }

  /**
   * Disable sounds
   */
  disable() {
    this.enabled = false;
    this.saveSoundPreference(false);
    console.log('🔇 Sounds disabled');
  }

  /**
   * Toggle sound on/off
   */
  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Set global volume
   * @param {number} volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume(this.volume);
    });
    console.log(`🔊 Volume set to: ${this.volume}`);
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
    });
  }

  /**
   * Cleanup and unload all sounds
   */
  cleanup() {
    this.stopAll();
    Object.values(this.sounds).forEach(sound => {
      sound.unload();
    });
    this.sounds = {};
    this.initialized = false;
    console.log('🔇 SoundManager cleaned up');
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
export default soundManager;
