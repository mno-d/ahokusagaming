import { useCallback } from 'react';

// Using browser's AudioContext for synthesized sounds to avoid external assets dependency for now
// In a real production app, we would load actual audio files

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'start' | 'clear';

export function useSound() {
  const playSound = useCallback((type: SoundType) => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch (type) {
      case 'click':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'hover':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        gainNode.gain.setValueAtTime(0.02, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;

      case 'success':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.linearRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'error':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'start':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.linearRampToValueAtTime(800, now + 0.5);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        break;
        
      case 'clear':
        // Arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gn = audioContext.createGain();
          osc.connect(gn);
          gn.connect(audioContext.destination);
          
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          const startTime = now + i * 0.1;
          gn.gain.setValueAtTime(0.1, startTime);
          gn.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
          
          osc.start(startTime);
          osc.stop(startTime + 0.3);
        });
        break;
    }
  }, []);

  return { playSound };
}
