import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Trash2 } from "lucide-react";
import { useBridgeStore, type ChatMessage } from "@/store/useBridgeStore";
import { Link } from "@tanstack/react-router";

const QUICK_REPLIES = [
  "Find a device near me",
  "Where should I start learning?",
  "Help me find a mentor",
  "What is Bridge?",
];

const OPENER: ChatMessage = {
  id: "opener",
  role: "assistant",
  content:
    "Hey! I'm the Bridge Guide. I can help you find a device near you, figure out where to start learning, or pick the right mentor. What do you need?",
};

// Render assistant text, turning /devices /learn /mentors into nav chips
function renderAssistant(text: string) {
  const parts = text.split(/(\/devices|\/learn|\/mentors)/g);
  return parts.map((p, i) => {
    if (p === "/devices" || p === "/learn" || p === "/mentors") {
      return (
        <Link
          key={i}
          to={p}
          className="mx-0.5 inline-flex items-center rounded-full bg-brand/15 px-2 py-0.5 text-xs font-medium text-violet hover:bg-brand/25"
        >
          {p}
        </Link>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export function AIGuide() {
  const { chatOpen, setChatOpen, chatMessages, addMessage, updateLastAssistant, clearChat } = useBridgeStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const messagesToRender = chatMessages.length ? chatMessages : [OPENER];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading, chatOpen]);

  const send = async (text: string) => {
    const userText = text.trim();
    if (!userText || loading) return;
    setError(null);

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: userText };
    addMessage(userMsg);
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "" };
    addMessage(assistantMsg);

    setInput("");
    setLoading(true);

    try {
      const history = [...chatMessages, userMsg]
        .filter((m) => m.content.trim())
        .map((m) => ({ role: m.role, content: m.content }));

      const resp = await fetch("/api/public/hooks/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong — try again in a moment.");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":") || !line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              updateLastAssistant(acc);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
      if (!acc) updateLastAssistant("Something went wrong — try again in a moment.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong — try again in a moment.";
      setError(msg);
      updateLastAssistant(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setChatOpen(true)}
        aria-label="Ask Bridge"
        className="orbit-halo fixed bottom-5 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-grad-primary px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(123,94,167,0.6)] transition-transform hover:scale-[1.03] sm:h-14 sm:px-5"
      >
        <span className="orbit-dot" />
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Ask Bridge</span>
      </button>

      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setChatOpen(false)}
              className="fixed inset-0 z-40 bg-black/50"
            />
            <motion.aside
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 z-50 flex h-[88vh] flex-col border-t border-card-border bg-card sm:bottom-5 sm:right-5 sm:left-auto sm:h-[640px] sm:w-[420px] sm:rounded-2xl sm:border"
            >
              <header className="flex items-center justify-between border-b border-card-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-violet">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-display text-base font-bold leading-none">Bridge Guide</div>
                    <div className="text-[11px] text-muted-foreground">Powered by AI</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={clearChat} aria-label="Clear chat" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setChatOpen(false)} aria-label="Close chat" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messagesToRender.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-grad-primary text-white"
                          : "bg-surface-2 text-foreground"
                      }`}
                    >
                      {m.content ? renderAssistant(m.content) : (
                        <span className="inline-flex items-center gap-1.5 py-1">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {chatMessages.length === 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {QUICK_REPLIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="rounded-full border border-card-border bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand/50 hover:text-violet"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs">
                    <div className="text-destructive-foreground">{error}</div>
                    <button onClick={() => send(chatMessages[chatMessages.length - 2]?.content ?? "Hi")} className="mt-2 text-violet hover:underline">
                      Retry
                    </button>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2 border-t border-card-border p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  className="h-12 flex-1 rounded-full border border-card-border bg-background px-4 text-sm outline-none focus:border-brand/60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-grad-primary text-white disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
