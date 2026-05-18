import { createFileRoute } from "@tanstack/react-router";

// Sarah — warm, conversational female voice
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export const Route = createFileRoute("/api/public/hooks/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { text } = (await request.json()) as { text?: string };
          if (!text || typeof text !== "string" || text.length > 5000) {
            return new Response(JSON.stringify({ error: "Invalid text" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const apiKey = process.env.ELEVENLABS_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "Voice not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Strip route paths like /devices /learn /mentors so they aren't spoken literally
          const spoken = text.replace(/\/(devices|learn|mentors)/g, "$1");

          const resp = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream?output_format=mp3_44100_128`,
            {
              method: "POST",
              headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: spoken,
                model_id: "eleven_turbo_v2_5",
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75,
                  style: 0.35,
                  use_speaker_boost: true,
                  speed: 1.0,
                },
              }),
            },
          );

          if (!resp.ok || !resp.body) {
            const errText = await resp.text().catch(() => "");
            console.error("ElevenLabs TTS error:", resp.status, errText);
            return new Response(JSON.stringify({ error: "TTS failed" }), {
              status: 502,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(resp.body, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "no-store",
            },
          });
        } catch (e) {
          console.error("tts handler error:", e);
          return new Response(JSON.stringify({ error: "Unknown error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
