import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, MoreVertical, Check, Clock } from "lucide-react";
import { Layout } from "@/components/bridge/Layout";
import { useBridgeStore } from "@/store/useBridgeStore";
import { MENTORS, type Mentor } from "@/lib/mockData";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Find a mentor — Bridge" },
      { name: "description", content: "Free 30-minute sessions with vetted tech mentors from Google, BBC, Monzo, Spotify, NHS Digital, ASOS and more." },
      { property: "og:title", content: "Find a mentor — Bridge" },
      { property: "og:description", content: "Vetted tech mentors offering free 30-minute sessions to UK young people." },
    ],
  }),
  component: MentorsPage,
});

const FILTERS = ["All", "Engineering", "Design", "Product", "AI", "Career advice"] as const;
const SLOTS = ["Tomorrow 4:30pm", "Tomorrow 6:00pm", "Thursday 5:30pm", "Saturday 11:00am"];

function MentorsPage() {
  const { mentorFilter, setMentorFilter } = useBridgeStore();
  const [selected, setSelected] = useState<Mentor | null>(null);

  const list = useMemo(() => {
    if (mentorFilter === "All") return MENTORS;
    return MENTORS.filter((m) => m.category === mentorFilter);
  }, [mentorFilter]);

  return (
    <Layout>
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Find a mentor.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            All mentors are vetted. Sessions are free. They remember what it was like to be you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setMentorFilter(f)}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                mentorFilter === f ? "border-mint bg-mint text-mint-foreground" : "border-card-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="card-surface card-surface-hover p-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full font-display text-base font-bold text-background"
                  style={{ background: m.color }}
                  aria-hidden
                >
                  {m.initials}
                </div>
                <details className="relative">
                  <summary className="list-none cursor-pointer h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2">
                    <MoreVertical className="h-4 w-4" />
                  </summary>
                  <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-md border border-card-border bg-card text-xs shadow-lg">
                    <button className="block w-full px-3 py-2 text-left hover:bg-surface-2">Report mentor</button>
                    <button className="block w-full px-3 py-2 text-left hover:bg-surface-2">Block</button>
                  </div>
                </details>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold leading-tight">{m.name}</h3>
              <div className="mt-1 text-sm text-muted-foreground">{m.role} · {m.company}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-mint">
                <Clock className="h-3 w-3" /> {m.availability}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.skill_tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-mint"><ShieldCheck className="h-3 w-3" /> Verified by Centauri</span>
              </div>
              <button onClick={() => setSelected(m)} className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-mint text-sm font-semibold text-mint-foreground">
                Book a free session
              </button>
            </motion.article>
          ))}
        </div>

        {list.length === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-card-border p-8 text-center text-sm">
            No {mentorFilter} mentors right now — check back soon.
          </div>
        )}

        <div className="mt-12 rounded-lg border border-card-border bg-card/40 p-5 text-center">
          <div className="font-display text-lg font-bold">Are you a tech professional?</div>
          <p className="text-sm text-muted-foreground">30 minutes of your time changes a year of someone else's.</p>
          <button className="mt-3 inline-flex h-11 items-center justify-center rounded-md border border-mint/60 px-5 text-sm font-semibold text-mint hover:bg-mint/10">
            Become a mentor →
          </button>
        </div>
      </section>

      <MentorDrawer mentor={selected} onClose={() => setSelected(null)} />
    </Layout>
  );
}

function MentorDrawer({ mentor, onClose }: { mentor: Mentor | null; onClose: () => void }) {
  const [form, setForm] = useState({ first_name: "", email: "", slot: "", message: "" });
  const [done, setDone] = useState(false);

  const close = () => { setDone(false); setForm({ first_name: "", email: "", slot: "", message: "" }); onClose(); };

  return (
    <AnimatePresence>
      {mentor && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-50 bg-black/60" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto border-l border-card-border bg-card sm:w-[460px]"
            role="dialog" aria-modal="true"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-card-border bg-card px-5 py-4">
              <span className="text-sm text-muted-foreground">Mentor</span>
              <button onClick={close} aria-label="Close" className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-surface-2"><X className="h-4 w-4" /></button>
            </header>

            <div className="p-5">
              {!done ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full font-display text-lg font-bold text-background" style={{ background: mentor.color }}>{mentor.initials}</div>
                    <div>
                      <h2 className="font-display text-xl font-bold">{mentor.name}</h2>
                      <div className="text-sm text-muted-foreground">{mentor.role} · {mentor.company}</div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed">{mentor.story}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mentor.skill_tags.map((t) => (
                      <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">{t}</span>
                    ))}
                  </div>

                  <div className="mt-6 text-sm font-medium">Pick a 30-min slot</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {SLOTS.map((s) => (
                      <button key={s} onClick={() => setForm({ ...form, slot: s })}
                        className={`h-12 rounded-md border text-sm transition-colors ${form.slot === s ? "border-mint bg-mint/10 text-foreground" : "border-card-border hover:border-mint/40"}`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => { e.preventDefault(); if (form.first_name && form.email && form.slot) setDone(true); }}
                    className="mt-6 space-y-3"
                  >
                    <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name"
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-mint/60" />
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email"
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-mint/60" />
                    <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Anything to mention up front? (optional)"
                      className="w-full rounded-md border border-card-border bg-background p-3 text-sm outline-none focus:border-mint/60" />
                    <button type="submit" disabled={!form.first_name || !form.email || !form.slot}
                      className="inline-flex h-12 w-full items-center justify-center rounded-md bg-mint text-sm font-semibold text-mint-foreground disabled:opacity-40">
                      Request session
                    </button>
                  </form>

                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-mint"><ShieldCheck className="h-3 w-3" /> Verified by Centauri</span>
                    <button className="hover:text-foreground">Report</button>
                  </div>
                </>
              ) : (
                <div className="pt-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/15 text-mint"><Check className="h-6 w-6" /></div>
                  <h2 className="mt-4 font-display text-xl font-bold">Request sent.</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{mentor.name.split(" ")[0]} has your request. Usually replies within 24 hours.</p>
                  <button onClick={close} className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-card-border px-6 text-sm font-medium">Done</button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
