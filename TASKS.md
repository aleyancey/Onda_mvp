```markdown
# Project Plan & Modular Steps

This is a phased roadmap for development. Each step is a self-contained module, making it easier to track progress and debug.

## Phase 1: Foundation (The "Hello, World" of Sound)
- [ ] Set up the React + Capacitor project.
- [ ] Implement a button that requests microphone permission.
- [ ] Create a simple feature that takes microphone input and plays it back through the speakers.
- [ ] Add a simple audio player that can play a pre-loaded sound file.

## Phase 2: The Core Experience (Retreat Mode)
- [ ] Create or source at least one high-quality, long-form ambient soundscape audio file.
- [ ] Combine the mic input and the pre-loaded soundscape, layering them together using the Web Audio API.
- [ ] Implement a button to toggle this layered playback on and off with a gentle fade.

## Phase 3: The "Magic" Interaction (Mantra & Adaptive Listening)
- [ ] Replace the toggle button with a basic Web Speech API implementation that listens for the mantra.
- [ ] Implement the momentary silence effect upon activation.
- [ ] Integrate the Web Audio API's decibel analysis to listen for volume spikes.
- [ ] Implement the logic to dynamically adjust the soundscape's volume or a filter based on the decibel input.

