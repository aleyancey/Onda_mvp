import './App.css';
import React from 'react';

function App() {
  // Placeholder for future mic access logic
  const handleOrbClick = () => {
    alert('Orb clicked! (Mic access coming soon)');
  };

  return (
    <div className="app-bg">
      <div className="orb-container">
        <button className="orb-glow" onClick={handleOrbClick} aria-label="Activate microphone">
          {/* Orb visual only, no text */}
        </button>
        <div className="orb-caption">Speak to begin</div>
      </div>
    </div>
  );
}

export default App;
