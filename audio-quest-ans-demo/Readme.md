# Audio to Text & Q&A Demo with Whisper and WebGPU LLM

This project demonstrates a simple Proof-of-Concept (PoC) for capturing audio from the microphone, transcribing it using Whisper via Hugging Face Transformers.js, and generating answers using a browser-compatible language model with WebGPU acceleration.

---

## Project Structure

Audio-To-Text-WebLLM/  
└── audio-quest-ans-demo/  
   └── index.html


---

## Features

- **Audio capture** using Web MediaRecorder API.
- **Audio transcription** with the Whisper Tiny model running natively in the browser on WebGPU.
- **Text generation / Q&A** using a small instruction-tuned language model running locally on WebGPU via Transformers.js.
- Fully client-side inference without server calls (except loading model files from the web).

---

## How to Run

1. **Serve the project folder** using a local HTTP server (required for WebGPU and WASM loading).  
   Example (Python 3):  
    cd Audio-To-Text-WebLLM/audio-quest-ans-demo
    python3 -m http.server 8000


2. **Open in a WebGPU-compatible browser** (latest Chrome or Edge with WebGPU enabled).  
Navigate to: `http://localhost:8000/index.html`

3. **Use the interface:**  
- Click **Start** to begin recording your voice question.  
- Click **Stop** to finish recording and trigger transcription & answer generation.
- See the transcribed question and model-generated answer displayed.

---

## Known Limitations

- The default text-generation model (`onnx-community/gpt2-ONNX` or similar) running locally is lightweight and prone to repetitive or generic answers. It lacks deep knowledge or instruction tuning.
- Browser-based ONNX/WebGPU LLMs currently do not support recent large instruction-tuned models.
- For improved answer quality, consider adapting the app to send transcribed text to remote LLM APIs (OpenAI, Hugging Face, etc.) for inference.

---

## Technologies Used

- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js/en/index) — for ML model pipelines in the browser.
- ONNX models converted for WebGPU inference.
- Web MediaRecorder API for audio recording.
- Whisper Tiny ASR model for transcription.
- Simple browser UI with vanilla JavaScript.

---

## Tips for Extension

- Integrate with cloud LLM APIs for high-quality answers if you need production-grade performance.
- Experiment with different public ONNX/text-generation models listed on Hugging Face.
- Add UI features: streaming transcription, stop/start toggles, or context input for better Q&A.

---

## Contact & Support

This PoC was created with help from AI assistants and community resources. For questions and collaboration, open an issue or pull request on the project repository.

---

**Enjoy building with browser AI!**
