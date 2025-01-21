// Create an audio context lazily since it requires user interaction
let audioContext: AudioContext | null = null;

export const NotificationSound = {
  play: async () => {
    try {
      // Initialize audio context on first play (requires user interaction)
      if (!audioContext) {
        audioContext = new AudioContext();
      }

      // Simple beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // frequency in hertz
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // volume

      // Start and stop the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1); // Duration in seconds

    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }
}; 