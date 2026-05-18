import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/stt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.ELEVENLABS_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "Voice not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const incoming = await request.formData();
          const audio = incoming.get("audio");
          if (!(audio instanceof Blob)) {
            return new Response(JSON.stringify({ error: "Missing audio" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          // Cap at ~10MB to avoid abuse
          if (audio.size > 10 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: "Audio too large" }), {
              status: 413,
              headers: { "Content-Type": "application/json" },
            });
          }

          const fd = new FormData();
          fd.append("file", audio, "input.webm");
          fd.append("model_id", "scribe_v2");
          fd.append("tag_audio_events", "false");
          fd.append("diarize", "false");

          const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
            method: "POST",
            headers: { "xi-api-key": apiKey },
            body: fd,
          });

          if (!resp.ok) {
            const errText = await resp.text().catch(() => "");
            console.error("ElevenLabs STT error:", resp.status, errText);
            return new Response(JSON.stringify({ error: "Transcription failed" }), {
              status: 502,
              headers: { "Content-Type": "application/json" },
            });
          }

          const data = (await resp.json()) as { text?: string };
          return new Response(JSON.stringify({ text: data.text ?? "" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("stt handler error:", e);
          return new Response(JSON.stringify({ error: "Unknown error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
