# Onda: A Sound-Based Co-Regulator

**Version 1.0 - MVP for Prototype Demonstration (Budget-Conscious Edition)**

## 1. Product Vision

*Onda* is an ambient AI interface that uses layered, generative sound to regulate the user's nervous system. It's an **audio-native tool for emotional attunement**, listening to the environment and responding with a sonic layer that provides calm and focus. The core interaction is through a quiet, intentional mantra—not a visual UI.

## 2. Product Requirements (The What)

### 2.1 Core Functionality: The Retreat Mode

The MVP will focus exclusively on the "Retreat" mode.

* **Activation:** The user says a specific mantra (e.g., "Onda"). The app detects this phrase and initiates a **momentary silence**, a "sonic inhale," that acts as a ritualistic cue.
* **The Sonic Cloak:** Immediately following the silence, the app begins playing a **pre-generated, high-quality ambient soundscape**. This soundscape is layered over the live environmental audio captured by the microphone, creating a calming "cloak" of sound.
* **Deactivation:** The user repeats the mantra, and the soundscape gently **fades out**, returning them to their natural environment.

### 2.2 Adaptive Listening: The Co-regulatory Loop

The MVP's "adaptive listening" will be simplified to a **real-time decibel level analysis**.

* **Input:** The app continuously monitors the microphone's input for sudden, significant changes in volume (decibels).
* **Output:** When a sudden spike in decibel level is detected, the app will trigger a pre-defined, subtle sonic change (e.g., a gentle swell in the soundscape's volume or a change in frequency).

### 2.3 Technical Details & Constraints

* **Platform:** A web-based prototype, wrapped in **Capacitor** for reliable microphone access and audio fidelity on mobile devices.
* **Technology Stack:** React + Web Audio API / Tone.js. All "listening" logic is handled with free, local browser APIs. The soundscapes will be a small set of **pre-generated audio files** to avoid ongoing costs for generative AI.
* **Data Layer:** The MVP will be a **stateless prototype** with no data persistence, keeping costs at zero.

