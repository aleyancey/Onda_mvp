import './App.css';
import React from 'react';

function AudioPlayer({ src, label }) {
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const audioEl = React.useRef(null);

  React.useEffect(() => {
    if (audioEl.current) {
      playing ? audioEl.current.play() : audioEl.current.pause();
      audioEl.current.muted = muted;
    }
  }, [playing, muted]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        className="orb-glow"
        style={{ width: 80, height: 80, marginBottom: 12, fontSize: 22, borderRadius: '50%', filter: 'none', animation: 'none', boxShadow: '0 0 28px 6px #b388ff, 0 0 60px 24px #7c4dff33' }}
        onClick={() => setPlaying(p => !p)}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      >
        {playing ? '⏸' : '▶️'}
      </button>

      <audio
        ref={audioEl}
        src={src}
        preload="auto"
        onEnded={() => setPlaying(false)}
      />
      <div style={{ color: '#e0e0e0', fontSize: 14, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function App() {
  // Handles orb button click: requests mic permission and plays back mic input
  const [micActive, setMicActive] = React.useState(false);
  const [permissionPrompted, setPermissionPrompted] = React.useState(false);
  const [orbGlow, setOrbGlow] = React.useState(0.5); // 0.0 - 1.0
  const [orbAnimSpeed, setOrbAnimSpeed] = React.useState(6); // seconds per cycle, lower=faster
  const audioRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const sustainedVolumeRef = React.useRef(0);
  const micGainNodeRef = React.useRef(null);
  const audioCtxRef = React.useRef(null);
  const [micMuted, setMicMuted] = React.useState(false);

  // Animate orb based on mic input
  const animateOrb = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);
    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const val = (dataArray[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / bufferLength);
    // Sustained sound (glow): running average
    sustainedVolumeRef.current = sustainedVolumeRef.current * 0.92 + rms * 0.08;
    setOrbGlow(Math.min(sustainedVolumeRef.current * 2, 1));
    // Frequency analysis for animation speed
    const freqBuffer = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(freqBuffer);
    // Find dominant frequency bin
    let maxVal = 0, maxIdx = 0;
    for (let i = 0; i < freqBuffer.length; i++) {
      if (freqBuffer[i] > maxVal) {
        maxVal = freqBuffer[i];
        maxIdx = i;
      }
    }
    // Map frequency bin to animation speed (higher freq = faster)
    const minSpeed = 2.5, maxSpeed = 7.5; // seconds per cycle
    const speed = maxSpeed - ((maxIdx / freqBuffer.length) * (maxSpeed - minSpeed));
    setOrbAnimSpeed(speed);
    animationRef.current = requestAnimationFrame(animateOrb);
  };

  const handleOrbClick = async () => {
    if (!micActive) {
      try {
        setPermissionPrompted(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        // Create audio context and analyser
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        // Layering: use GainNode for mic volume/mute
        const micGain = audioCtx.createGain();
        micGain.gain.value = micMuted ? 0 : 1;
        micGainNodeRef.current = micGain;
        source.connect(analyser);
        analyser.connect(micGain);
        micGain.connect(audioCtx.destination);
        analyserRef.current = analyser;
        // Start animation
        animationRef.current = requestAnimationFrame(animateOrb);
        setMicActive(true);
      } catch (err) {
        alert('Microphone access denied or unavailable. Please allow permission and try again.');
        setMicActive(false);
      }
    } else {
      // Stop mic playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      analyserRef.current = null;
      micGainNodeRef.current = null;
      setOrbGlow(0.5);
      setOrbAnimSpeed(6);
      setMicActive(false);
    }
  };

  return (
    <div className="app-bg">
      <div className="orb-container">
        <button
          className="orb-glow"
          onClick={handleOrbClick}
          aria-label="Activate microphone"
          style={{
            boxShadow: `0 0 ${40 + 60 * orbGlow}px ${10 + 30 * orbGlow}px #b388ff, 0 0 ${80 + 100 * orbGlow}px ${40 + 60 * orbGlow}px #7c4dff44`,
            filter: `brightness(${1 + orbGlow * 0.5})`,
            animationDuration: `${orbAnimSpeed}s`,
            transition: 'box-shadow 0.15s, filter 0.15s',
          }}
        >
          {/* Orb visual only, no text */}
        </button>
        <div className="orb-caption">
          {permissionPrompted && !micActive
            ? 'Please allow microphone permission.'
            : micActive
              ? 'Mic is live! Speak and you will hear yourself.'
              : 'Tap the orb to begin'}
        </div>
        {/* Mic mute toggle */}
        <button
          onClick={() => {
            setMicMuted(m => {
              if (micGainNodeRef.current) {
                micGainNodeRef.current.gain.value = !m ? 0 : 1;
              }
              return !m;
            });
          }}
          style={{ margin: '1.2rem 0 0.5rem', background: 'none', color: '#b388ff', border: 'none', fontSize: 18, cursor: 'pointer', letterSpacing: '0.05em' }}
          aria-label={micMuted ? 'Unmute mic' : 'Mute mic'}
          disabled={!micActive}
        >

        </button>
        {/* Simple audio players for pre-loaded sound files */}
        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
          <AudioPlayer src="/zona-arqueologica-el-meco.mp3" label="Zona Arqueologica El Meco" />
          <AudioPlayer src="/brower-park-49.mp3" label="Brower Park 49" />
          <AudioPlayer src="/brower-park-46.mp3" label="Brower Park 46" />
        </div>
      </div>
    </div>
  );
}

export default App;
