import React, { useRef, useState } from 'react';

// Retreat Mode: Minimal component layering mic input and ambient file using Web Audio API
function App() {
  const [active, setActive] = useState(false); // Is session running?
  const audioCtxRef = useRef(null);           // Web Audio context
  const micStreamRef = useRef(null);          // User mic stream
  const micSourceRef = useRef(null);          // Mic MediaStreamSource
  const micGainRef = useRef(null);            // Mic GainNode
  const fileSourceRef = useRef(null);         // AudioBufferSourceNode for file
  const fileGainRef = useRef(null);           // File GainNode

  // Start session: get mic, play ambient, layer both
  const startSession = async () => {
    if (active) return;
    try {
      // 1. Create audio context
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      // 2. Get mic access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const micSource = ctx.createMediaStreamSource(stream);
      micSourceRef.current = micSource;
      const micGain = ctx.createGain();
      micGain.gain.value = 1; // Set mic volume (adjustable)
      micGainRef.current = micGain;
      micSource.connect(micGain);
      micGain.connect(ctx.destination);

      // 3. Load and play ambient file
      const resp = await fetch('/Brooklyn_Birds.mp3'); // Placeholder file
      const arrBuf = await resp.arrayBuffer();
      const audioBuf = await ctx.decodeAudioData(arrBuf);
      const fileSource = ctx.createBufferSource();
      fileSource.buffer = audioBuf;
      fileSource.loop = true;
      fileSourceRef.current = fileSource;
      const fileGain = ctx.createGain();
      fileGain.gain.value = 1; // Set ambient volume (adjustable)
      fileGainRef.current = fileGain;
      fileSource.connect(fileGain);
      fileGain.connect(ctx.destination);
      fileSource.start();

      setActive(true);
    } catch (err) {
      alert('Mic access or audio playback failed.');
      cleanup();
    }
  };

  // Stop session: stop mic/file, release resources
  const cleanup = () => {
    setActive(false);
    if (fileSourceRef.current) {
      try { fileSourceRef.current.stop(); } catch {}
      fileSourceRef.current.disconnect();
      fileSourceRef.current = null;
    }
    if (fileGainRef.current) {
      fileGainRef.current.disconnect();
      fileGainRef.current = null;
    }
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    if (micGainRef.current) {
      micGainRef.current.disconnect();
      micGainRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  // Toggle session
  const handleClick = () => {
    if (!active) startSession();
    else cleanup();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101322' }}>
      <button
        onClick={handleClick}
        style={{ fontSize: 20, padding: '1.2em 2.8em', borderRadius: 32, border: 'none', background: '#23244b', color: '#e0e0e0', letterSpacing: '0.08em', cursor: 'pointer', boxShadow: '0 2px 18px #0008' }}
        aria-label={active ? 'Stop Retreat Mode' : 'Start Retreat Mode'}
      >
        {active ? 'Stop Retreat Mode' : 'Start Retreat Mode'}
      </button>
    </div>
  );
}

export default App;
