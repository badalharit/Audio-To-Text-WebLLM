# 🎙️ In-Browser Audio Transcription Demo (Whisper & Voxtral)

A React web app for real-time audio transcription using ONNX models with WebGPU acceleration.

## Features

- **Whisper (Fully Working)**  
  Uses the `Xenova/whisper-small` ONNX model for accurate, real-time transcription inside the browser. Works with WebGPU or CPU fallback. Upload audio (WAV, MP3, etc.) and get instant transcription without server calls.

- **Voxtral Mini 3B (Experimental)**  
  Integration scaffolded but currently inactive due to pending JS library support. Will be enabled once official support is available.

## How It Works

1. Upload an audio file via the browser.
2. Audio is decoded using Web Audio API to raw PCM data.
3. ONNX model (Whisper) transcribes audio client-side using WebGPU or CPU.
4. Transcription displays instantly — all offline and private.

## Getting Started

### Prerequisites
- Node.js 16+ and npm installed
- Chromium-based browser with WebGPU enabled (optional, fallback to CPU available)

### Installation
git clone <repo-url>
cd <repo-name>
npm install
npm start


### Usage
- Open `http://localhost:3000`
- Upload your audio file
- View transcription live on screen

## Notes
- Voxtral Mini 3B support is experimental and disabled until the JS library fully supports it.
- Whisper uses optimized ONNX weights from Xenova's community repository.

## License

MIT License

---

*Stay tuned for updates including Voxtral Mini 3B in-browser transcription support!*

