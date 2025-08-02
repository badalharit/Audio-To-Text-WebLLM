import { useEffect, useState } from "react";
import { pipeline, env } from "@xenova/transformers";

// Disable local-model lookup and browser cache for fresh fetch
env.allowLocalModels = false;
env.useBrowserCache = false;

export default function WhisperWebGPUDemo() {
  const [asr, setAsr] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Whisper ASR pipeline on mount
  useEffect(() => {
    async function loadModel() {
      try {
        const pipe = await pipeline(
          "automatic-speech-recognition",
          "Xenova/whisper-medium",
          { device: "webgpu" } // set to "cpu" to force CPU
        );
        setAsr(() => pipe);
      } catch (err) {
        console.error("Model load failed:", err);
        setError("Failed to load Whisper model. Please try again later.");
      }
    }
    loadModel();
  }, []);

  // Decode audio file to Float32Array PCM
  async function decodeAudioFile(file) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = await file.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf);
    return decoded.getChannelData(0);
  }

  // Handle file upload & transcription
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !asr) return;

    setError("");
    setAudioURL(URL.createObjectURL(file));
    setLoading(true);
    setTranscription("");

    try {
      const pcm = await decodeAudioFile(file);
      const result = await asr(pcm);
      setTranscription(result.text ?? result.generated_text ?? "");
    } catch (err) {
      console.error("Transcription error:", err);
      setError("Error during transcription. Please try a different file.");
      setTranscription("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">
        🎙️ Whisper-Small ASR Demo (WebGPU)
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!asr && !error && <p>Loading Whisper model…</p>}

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
