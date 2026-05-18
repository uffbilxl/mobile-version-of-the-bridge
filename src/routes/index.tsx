import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Laptop, GraduationCap, Users, Sparkles, ArrowRight } from "lucide-react";
import { Layout } from "@/components/bridge/Layout";
import { ScrambleCounter } from "@/components/bridge/ScrambleCounter";
import { StarField } from "@/components/bridge/StarField";
import { useMagnetic } from "@/hooks/useMagnetic";
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
  { value: 267, label: "devices donated" },
  { value: 8, label: "mentors" },
  { value: 4, label: "cities" },
  { value: 500, label: "young people helped" },
];

const features = [
  { icon: Laptop, title: "Devices", body: "Free or loaned laptops, tablets, phones, and broadband — matched to your postcode.", cta: "Find a device", to: "/devices" as const },
  { icon: GraduationCap, title: "Learning", body: "Paths that start from absolute zero. No jargon, no pretending you already know things.", cta: "Start learning", to: "/learn" as const },
  { icon: Users, title: "Mentors", body: "Free 30-minute sessions with vetted people from Google, BBC, Monzo, Spotify, and more.", cta: "Find a mentor", to: "/mentors" as const },
];

const testimonials = [
  { quote: "I didn't have WiFi at home until Bridge sorted me a broadband kit. Now I'm three weeks into a bootcamp.", name: "Jaylen, 19, Birmingham" },
  { quote: "I thought design was for people who went to art school. My mentor from the BBC showed me otherwise in one session.", name: "Aisha, 22, Leeds" },
  { quote: "Typed my postcode in, picked up a ThinkPad two days later. Felt like something actually worked for once.", name: "Marcus, 17, Birmingham" },
];

const HEADLINE_LINE_1 = "Tech is for you.".split(" ");
const HEADLINE_LINE_2 = "We mean it.".split(" ");
const TOTAL_WORDS = HEADLINE_LINE_1.length + HEADLINE_LINE_2.length;
const FINAL_STOP_DELAY = TOTAL_WORDS * 0.08 + 0.6;

const wordContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const wordVariant = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

function Landing() {
  const setChatOpen = useBridgeStore((s) => s.setChatOpen);
  const onMag = useMagnetic();
  const reduce = useReducedMotion();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-card-border bg-grad-hero">
        <StarField />
        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            Built with Centauri · Youth Digital Inclusion
          </motion.div>

          <motion.h1
            variants={wordContainer}
            initial="hidden"
            animate="visible"
            className="mt-6 text-balance font-display text-5xl font-extrabold leading-[0.95] tracking-tight heading-glow sm:text-6xl md:text-7xl"
          >
            <span className="block">
              {HEADLINE_LINE_1.map((w, i) => {
                const isLast = i === HEADLINE_LINE_1.length - 1;
                const text = isLast ? w.slice(0, -1) : w;
                return (
                  <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.25em]">
                    <motion.span variants={wordVariant} className="inline-block">
                      {text}
                      {isLast && "."}
                    </motion.span>
                  </span>
                );
              })}
            </span>
            <span className="block text-gradient">
              {HEADLINE_LINE_2.map((w, i) => {
                const isLast = i === HEADLINE_LINE_2.length - 1;
                const text = isLast ? w.slice(0, -1) : w;
                return (
                  <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.25em]">
                    <motion.span variants={wordVariant} className="inline-block">
                      {text}
                      {isLast && (
                        <motion.span
                          className="inline-block"
                          initial={{ scale: 1, color: "#A78BFA" }}
                          animate={reduce ? {} : { scale: [1, 1.4, 1], color: ["#A78BFA", "#A78BFA", "#A78BFA"] }}
                          transition={{ delay: FINAL_STOP_DELAY, duration: 0.6 }}
                        >
                          .
                        </motion.span>
                      )}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Get a device. Learn a skill. Find your people. All free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <span className="grad-border">
              <Link
                to="/devices"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-background px-6 text-sm font-semibold text-foreground"
              >
                <span className="text-gradient">Find a device near me</span>
                <ArrowRight className="h-4 w-4 text-violet" />
              </Link>
            </span>
            <Link
              to="/learn"
              className="inline-flex h-12 items-center justify-center rounded-md border border-brand/60 px-6 text-sm font-semibold text-violet transition-colors hover:bg-brand/10"
            >
              Start learning
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            Built to remove real barriers — not add more.
          </motion.p>
        </div>
      </section>

      {/* Stat bar */}
      <section className="border-b border-card-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-12 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-[2.5rem] font-bold leading-none text-violet">
                <ScrambleCounter value={s.value} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.08em] text-muted-foreground sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Four pillars */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-bold heading-glow sm:text-4xl">Four real barriers. Four answers.</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">No coding course can fix what's actually missing. Bridge does.</p>

        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              onMouseMove={onMag}
              variants={{
                hidden: { y: 30, opacity: 0, scale: 0.97 },
                visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } },
              }}
              className="card-surface card-surface-hover flex flex-col p-6"
            >
              <f.icon className="h-6 w-6 text-violet" />
              <div className="mt-4 font-display text-xl font-bold">{f.title}</div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.body}</p>
              <Link to={f.to} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet hover:gap-2 transition-all">
                {f.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}

          <motion.div
            onMouseMove={onMag}
            variants={{
              hidden: { y: 30, opacity: 0, scale: 0.97 },
              visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } },
            }}
            className="card-surface card-surface-hover flex flex-col p-6"
            style={{ borderColor: "rgba(123,94,167,0.4)", backgroundImage: "var(--grad-card)" }}
          >
            <Sparkles className="h-6 w-6 text-violet" />
            <div className="mt-4 font-display text-xl font-bold">Ask anything, any time</div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Not sure where to start? Our AI guide answers instantly — no judgement, no waitlist.
            </p>
            <button onClick={() => setChatOpen(true)} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet hover:gap-2 transition-all">
              Talk to Bridge <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-card-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-bold heading-glow sm:text-4xl">Real stories. Real names.</h2>
          <motion.div
            className="mt-10 grid gap-4 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
          >
            {testimonials.map((t) => (
              <motion.figure
                key={t.name}
                onMouseMove={onMag}
                variants={{
                  hidden: { y: 30, opacity: 0, scale: 0.97 },
                  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } },
                }}
                className="card-surface p-6"
              >
                <blockquote className="text-base leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">— {t.name}</figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
