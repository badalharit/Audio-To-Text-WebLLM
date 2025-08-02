// src/VoxtralWebGPUDemo.jsx

import { useEffect, useState } from "react";
import { pipeline, env } from "@huggingface/transformers";

// Prevent transformers.js from first looking for local model files,
// and disable caching to avoid stale or broken cached JSON.
env.allowLocalModels = false;
env.useBrowserCache = false;

export default function VoxtralWebGPUDemo() {
  const [asr, setAsr] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the automatic-speech-recognition pipeline on mount
  useEffect(() => {
    async function loadModel() {
      try {
        const pipe = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/Voxtral-Mini-3B-2507-ONNX",
          { device: "webgpu" } // or "cpu"
        );
        setAsr(() => pipe);
      } catch (err) {
        console.error("Model load failed:", err);
        setError("Failed to load Voxtral ASR model. Please try again later.");
      }
    }
    loadModel();
  }, []);

  // Decode uploaded file to Float32Array mono PCM
  async function decodeAudioFile(file) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = await file.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(buffer);
    return decoded.getChannelData(0);
  }

  // Handle file input change
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !asr) return;

    setError("");
    setAudioURL(URL.createObjectURL(file));
    setLoading(true);
    setTranscription("");

    try {
      const pcm = await decodeAudioFile(file);
      // Call ASR pipeline with English transcription prompt
      const result = await asr(pcm, { prompt: "lang:en [TRANSCRIBE]" });
      setTranscription(result.text ?? result.generated_text ?? "");
    } catch (err) {
      console.error("Transcription error:", err);
      setError("Error during transcription. Please try a different audio file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎙️ Voxtral Mini 3B ASR Demo</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!asr && !error && <p>Loading model...</p>}

      <input
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        disabled={!asr || loading}
        className="block mb-4 p-2 border rounded"
      />

      {audioURL && (
        <audio controls src={audioURL} className="w-full mb-4" />
      )}

      <div className="p-4 border rounded shadow min-h-[100px]">
        {loading
          ? "Transcribing..."
          : transcription || "Upload an audio file to begin transcription."}
      </div>
    </div>
  );
}
