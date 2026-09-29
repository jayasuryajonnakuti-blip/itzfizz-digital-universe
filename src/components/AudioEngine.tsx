import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { signalAudio } from '../lib/audioSignal';

export default function AudioEngine() {
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneOscillatorsRef = useRef<OscillatorNode[]>([]);
  const sequencerRef = useRef<NodeJS.Timeout | null>(null);

  const initAudio = () => {
    if (audioContextRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    signalAudio.init(ctx);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    if (signalAudio.analyser) {
      masterGain.connect(signalAudio.analyser);
    }
    masterGainRef.current = masterGain;

    // --- Space Cinematic Drone ---
    // Celestial harmonics (C Major / Lydian feel)
    const frequencies = [65.41, 130.81, 196.00, 261.63, 392.00, 493.88]; // C2, C3, G3, C4, G4, B4
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft sine waves for a spacey feel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Ultra-slow movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.02 + i * 0.01, ctx.currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.001, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300 + i * 150, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      const baseVol = 0.06 / (i + 1);
      gain.gain.setValueAtTime(baseVol, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start();
      droneOscillatorsRef.current.push(osc);
    });

    // --- Ethereal Delay / Reverb ---
    const delay = ctx.createDelay();
    const feedback = ctx.createGain();
    delay.delayTime.setValueAtTime(1.2, ctx.currentTime);
    feedback.gain.setValueAtTime(0.6, ctx.currentTime);
    masterGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(ctx.destination);

    // --- Celestial Melodic Sequencer ---
    const spaceScale = [261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25]; // C Major Scale
    
    const playNote = () => {
      if (isMuted) return;
      
      const noteFreq = spaceScale[Math.floor(Math.random() * spaceScale.length)];
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq * (Math.random() > 0.8 ? 2 : 1), ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 10);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(delay); // Connect to delay for spatial immersion

      osc.start();
      osc.stop(ctx.currentTime + 10);
    };

    const schedule = () => {
      sequencerRef.current = setTimeout(() => {
        playNote();
        schedule();
      }, 5000 + Math.random() * 5000);
    };

    schedule();

    setIsMuted(false);
    masterGain.gain.setTargetAtTime(0.4, ctx.currentTime, 3);
    if (ctx.state === 'suspended') ctx.resume();
  };

  const toggleMute = () => {
    if (!audioContextRef.current) {
      initAudio();
      return;
    }

    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;

    if (ctx.state === 'suspended') ctx.resume();

    if (isMuted) {
      masterGain?.gain.setTargetAtTime(0.4, ctx.currentTime, 1);
    } else {
      masterGain?.gain.setTargetAtTime(0.0001, ctx.currentTime, 1);
    }
    setIsMuted(!isMuted);
  };

  return (
    <button 
      onClick={toggleMute}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[100] p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-acid hover:text-ink transition-all group interactive"
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      <span className="absolute left-full ml-4 text-[9px] font-mono tracking-[0.4em] uppercase whitespace-nowrap opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none">
        {isMuted ? "Celestial Link Muted" : "Celestial Link Active"}
      </span>
    </button>
  );
}
