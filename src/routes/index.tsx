import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Laptop, GraduationCap, Users, Sparkles, ArrowRight } from "lucide-react";
import { Layout } from "@/components/bridge/Layout";
import { Counter } from "@/components/bridge/Counter";
import { useBridgeStore } from "@/store/useBridgeStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bridge — Tech is for you. We mean it." },
      { name: "description", content: "Get a device. Learn a skill. Find your people. All free. Bridge helps young people in the UK get online and into tech." },
      { property: "og:title", content: "Bridge — Tech is for you. We mean it." },
      { property: "og:description", content: "Devices, learning paths, mentors, and an AI guide. Built for 14–24 year olds in underserved UK communities." },
    ],
  }),
  component: Landing,
});

const stats = [
  { value: 1240, label: "devices donated" },
  { value: 310, label: "mentors" },
  { value: 6, label: "cities" },
  { value: 4800, label: "young people helped" },
];

const features = [
  { icon: Laptop, title: "Devices", body: "Free or loaned laptops, tablets, phones, and broadband — matched to your postcode.", cta: "Find a device", to: "/devices" as const },
  { icon: GraduationCap, title: "Learning", body: "Paths that start from absolute zero. No jargon, no pretending you already know things.", cta: "Start learning", to: "/learn" as const },
  { icon: Users, title: "Mentors", body: "Free 30-minute sessions with vetted people from Google, BBC, Monzo, Spotify, and more.", cta: "Find a mentor", to: "/mentors" as const },
];

const testimonials = [
  { quote: "I didn't have WiFi at home until Bridge sorted me a broadband kit. Now I'm three weeks into a bootcamp.", name: "Jaylen, 19, Manchester" },
  { quote: "I thought design was for people who went to art school. My mentor from the BBC showed me otherwise in one session.", name: "Aisha, 22, Leeds" },
  { quote: "Typed my postcode in, picked up a ThinkPad two days later. Felt like something actually worked for once.", name: "Marcus, 17, Birmingham" },
];

function Landing() {
  const setChatOpen = useBridgeStore((s) => s.setChatOpen);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-mint/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            Built with Centauri · Youth Digital Inclusion
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-balance font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
          >
            Tech is for you.<br />
            <span className="text-mint">We mean it.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Get a device. Learn a skill. Find your people. All free.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/devices" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-mint px-6 text-sm font-semibold text-mint-foreground transition-transform hover:scale-[1.02]">
              Find a device near me <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/learn" className="inline-flex h-12 items-center justify-center rounded-md border border-mint/60 px-6 text-sm font-semibold text-mint hover:bg-mint/10">
              Start learning
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            Built to remove real barriers — not add more.
          </motion.p>
        </div>
      </section>

      {/* Stat bar */}
      <section className="border-b border-card-border bg-card/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-12 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-extrabold text-mint sm:text-4xl">
                <Counter value={s.value} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Four pillars */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Four real barriers. Four answers.</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">No coding course can fix what's actually missing. Bridge does.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="card-surface card-surface-hover flex flex-col p-6"
            >
              <f.icon className="h-6 w-6 text-mint" />
              <div className="mt-4 font-display text-xl font-bold">{f.title}</div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.body}</p>
              <Link to={f.to} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-mint hover:gap-2 transition-all">
                {f.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="card-surface card-surface-hover flex flex-col p-6 border-mint/40 bg-gradient-to-br from-card to-mint/5"
          >
            <Sparkles className="h-6 w-6 text-mint" />
            <div className="mt-4 font-display text-xl font-bold">Ask anything, any time</div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Not sure where to start? Our AI guide answers instantly — no judgement, no waitlist.
            </p>
            <button onClick={() => setChatOpen(true)} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-mint hover:gap-2 transition-all">
              Talk to Bridge <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-card-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Real stories. Real names.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-surface p-6"
              >
                <blockquote className="text-base leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">— {t.name}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
