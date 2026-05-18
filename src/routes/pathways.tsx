import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Palette,
  Megaphone,
  Video,
  Brain,
  Globe,
  ArrowRight,
  Check,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Layout } from "@/components/bridge/Layout";
import { useMagnetic } from "@/hooks/useMagnetic";

export const Route = createFileRoute("/pathways")({
  head: () => ({
    meta: [
      { title: "Digital Skills Pathways — Bridge" },
      {
        name: "description",
        content:
          "Structured pathways in coding, design, marketing, video editing, AI, and web development — from absolute beginner to job-ready.",
      },
      { property: "og:title", content: "Digital Skills Pathways — Bridge" },
      {
        property: "og:description",
        content:
          "Pick a path. Every stage is mapped out — from zero, to know-a-little, to job-ready. All free.",
      },
    ],
  }),
  component: PathwaysPage,
});

type Stage = {
  label: "Starting from zero" | "Know a little" | "Job-ready";
  title: string;
  hours: number;
  outcomes: string[];
};

type Pathway = {
  id: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  accent: string; // tailwind text color class for icon
  dot: string;    // tailwind bg color class for accent dot
  career: string;
  stages: Stage[];
};

const PATHWAYS: Pathway[] = [
  {
    id: "coding",
    title: "Coding",
    tagline: "From your first line of Python to building real software.",
    icon: Code2,
    accent: "text-mint",
    dot: "bg-mint",
    career: "Junior Developer · Software Engineer · Data Analyst",
    stages: [
      {
        label: "Starting from zero",
        title: "What even is code?",
        hours: 6,
        outcomes: ["Write your first Python script", "Understand variables, loops, and functions", "Use the terminal without panic"],
      },
      {
        label: "Know a little",
        title: "Build with Python",
        hours: 14,
        outcomes: ["Build a small CLI tool", "Read & write files, call APIs", "Use Git and GitHub like a pro"],
      },
      {
        label: "Job-ready",
        title: "Ship a real project",
        hours: 24,
        outcomes: ["Build & deploy a full app", "Pair on an open-source PR", "Tackle interview-style problems"],
      },
    ],
  },
  {
    id: "design",
    title: "Design",
    tagline: "Figma, layout, and the eye that gets you hired.",
    icon: Palette,
    accent: "text-star",
    dot: "bg-star",
    career: "UI Designer · Product Designer · Brand Designer",
    stages: [
      {
        label: "Starting from zero",
        title: "Figma in a weekend",
        hours: 5,
        outcomes: ["Set up your first artboard", "Type, spacing, colour basics", "Design a clean landing screen"],
      },
      {
        label: "Know a little",
        title: "Design real products",
        hours: 12,
        outcomes: ["Components & auto-layout", "Mobile app flows", "Working with developers"],
      },
      {
        label: "Job-ready",
        title: "Portfolio that lands jobs",
        hours: 20,
        outcomes: ["3 case studies that tell a story", "Run a real user test", "Portfolio review with a mentor"],
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    tagline: "Get people to actually care — online.",
    icon: Megaphone,
    accent: "text-violet",
    dot: "bg-violet",
    career: "Social Media · Content · Growth · Brand",
    stages: [
      {
        label: "Starting from zero",
        title: "How the internet sells",
        hours: 4,
        outcomes: ["Who buys what, and why", "Write a hook that works", "Spot good vs bad marketing"],
      },
      {
        label: "Know a little",
        title: "Social, SEO, and email",
        hours: 10,
        outcomes: ["Plan a content calendar", "SEO basics that actually work", "Write an email people open"],
      },
      {
        label: "Job-ready",
        title: "Run a real campaign",
        hours: 18,
        outcomes: ["Set up paid ads on a tiny budget", "Read analytics without fear", "Pitch a strategy in 5 slides"],
      },
    ],
  },
  {
    id: "video",
    title: "Video editing",
    tagline: "Cuts, sound, story — for socials, YouTube, and brands.",
    icon: Video,
    accent: "text-mint",
    dot: "bg-mint",
    career: "Social Editor · YouTuber · Brand Video",
    stages: [
      {
        label: "Starting from zero",
        title: "CapCut in an afternoon",
        hours: 3,
        outcomes: ["Edit your first 30-sec reel", "Cuts, captions, transitions", "Find music that's actually free"],
      },
      {
        label: "Know a little",
        title: "Tell a story with cuts",
        hours: 9,
        outcomes: ["Pacing & rhythm", "Colour & sound basics", "Move from CapCut to DaVinci or Premiere"],
      },
      {
        label: "Job-ready",
        title: "Editor for hire",
        hours: 16,
        outcomes: ["Build a reel that books work", "Brand kits & templates", "Pricing your first paid edit"],
      },
    ],
  },
  {
    id: "ai",
    title: "AI",
    tagline: "Use AI like a pro — and understand what's under the hood.",
    icon: Brain,
    accent: "text-star",
    dot: "bg-star",
    career: "AI Operator · Prompt Engineer · ML pathways",
    stages: [
      {
        label: "Starting from zero",
        title: "AI without the hype",
        hours: 4,
        outcomes: ["Use ChatGPT, Claude, and Gemini well", "Write prompts that get results", "Spot when AI is making things up"],
      },
      {
        label: "Know a little",
        title: "Build with AI",
        hours: 10,
        outcomes: ["Automate boring tasks", "Build a small AI workflow", "Use AI in school, work, side projects"],
      },
      {
        label: "Job-ready",
        title: "Ship an AI app",
        hours: 20,
        outcomes: ["Call models from your own code", "Build a chatbot or assistant", "Understand the basics of how LLMs work"],
      },
    ],
  },
  {
    id: "web",
    title: "Web development",
    tagline: "From your first HTML page to a real deployed web app.",
    icon: Globe,
    accent: "text-violet",
    dot: "bg-violet",
    career: "Frontend Dev · Full-stack · Indie hacker",
    stages: [
      {
        label: "Starting from zero",
        title: "Your first website",
        hours: 6,
        outcomes: ["HTML & CSS that doesn't break", "Put a site online (for real)", "Make it work on mobile"],
      },
      {
        label: "Know a little",
        title: "JavaScript & React",
        hours: 14,
        outcomes: ["JavaScript fundamentals", "Build with React components", "Talk to an API"],
      },
      {
        label: "Job-ready",
        title: "Full-stack & ship it",
        hours: 24,
        outcomes: ["Add a database & auth", "Deploy to production", "Build a portfolio of 3 real sites"],
      },
    ],
  },
];

function PathwaysPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-card-border bg-grad-hero">
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-14 sm:px-6 sm:pt-20 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet" />
            Digital Skills Pathways
          </motion.div>
          <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Pick a path. <span className="text-gradient">Any starting point.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Six pathways. Three stages each — from absolute zero, to know-a-little,
            to job-ready. Every stage is short, real, and built with mentors who do
            this for a living.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/learn"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-grad-primary px-5 text-sm font-semibold text-white"
            >
              See all courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/mentors"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-card-border bg-card px-5 text-sm font-semibold hover:border-brand/60 hover:text-violet"
            >
              Get a mentor on your path
            </Link>
          </div>
        </div>
      </section>

      {/* Pathway grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
        >
          {PATHWAYS.map((p) => (
            <PathwayCard key={p.id} pathway={p} />
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-card-border bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">How a pathway works</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: "Pick where you are", b: "Starting from zero is a valid answer. Most people pick it." },
              { n: "02", t: "Do the stage", b: "Short lessons, real exercises, a mentor when you're stuck." },
              { n: "03", t: "Show what you built", b: "Each stage ends with something you can point at." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-card-border bg-background/40 p-5">
                <div className="font-mono text-xs text-violet">{s.n}</div>
                <div className="mt-2 font-display text-lg font-bold">{s.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function PathwayCard({ pathway }: { pathway: Pathway }) {
  const Icon = pathway.icon;
  const [openStage, setOpenStage] = useState<number | null>(0);
  const onMag = useMagnetic();

  return (
    <motion.article
      onMouseMove={onMag}
      variants={{
        hidden: { y: 24, opacity: 0, scale: 0.97 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="card-surface card-surface-hover flex flex-col p-5"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 ${pathway.accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[11px] text-muted-foreground">3 stages</span>
      </div>

      <h3 className="mt-4 font-display text-xl font-extrabold leading-tight">{pathway.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{pathway.tagline}</p>
      <div className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground/80">
        Leads to: <span className="text-foreground/80 normal-case tracking-normal">{pathway.career}</span>
      </div>

      <div className="mt-5 space-y-2">
        {pathway.stages.map((stage, i) => {
          const open = openStage === i;
          return (
            <div key={stage.label} className="rounded-md border border-card-border bg-background/40">
              <button
                onClick={() => setOpenStage(open ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
                aria-expanded={open}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${pathway.dot}`} />
                  <span className="truncate text-sm font-medium">{stage.label}</span>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{stage.hours}h</span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3">
                      <div className="text-sm font-semibold">{stage.title}</div>
                      <ul className="mt-2 space-y-1.5">
                        {stage.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${pathway.accent}`} />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <Link
        to="/learn"
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-card-border text-sm font-semibold hover:border-brand/60 hover:text-violet"
      >
        Start {pathway.title.toLowerCase()} <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}