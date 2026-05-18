import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/bridge/Layout";
import { COURSES, SKILL_PILLS, type Course, type LevelLabel } from "@/lib/mockData";
import { useBridgeStore, type QuizAnswers } from "@/store/useBridgeStore";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Bridge" },
      { name: "description", content: "Beginner-friendly digital skill paths: coding, design, AI, video, marketing, and web dev. Start from zero." },
      { property: "og:title", content: "Learn — Bridge" },
      { property: "og:description", content: "Pick a path, or take the quiz and we'll pick one with you. All free." },
    ],
  }),
  component: LearnPage,
});

const LEVEL_DOT: Record<LevelLabel, string> = {
  "Starting from zero": "bg-mint",
  "Know a little": "bg-amber",
  "Level up": "bg-lilac",
};

const ALL = "All";
const PILLS = [ALL, ...SKILL_PILLS];

function LearnPage() {
  const { skillPill, setSkillPill, courseProgress } = useBridgeStore();
  const [quizOpen, setQuizOpen] = useState(false);

  const filtered = useMemo(() => {
    if (skillPill === ALL) return COURSES;
    return COURSES.filter((c) => c.category === skillPill);
  }, [skillPill]);

  return (
    <Layout>
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Learn something real.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Short, no-fluff paths. Built for people who haven't done this before — and people who have.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
          {PILLS.map((p) => (
            <button
              key={p}
              onClick={() => setSkillPill(p)}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                skillPill === p ? "border-mint bg-mint text-mint-foreground" : "border-card-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} progressOverride={courseProgress[c.id]} />
          ))}
        </div>
      </section>

      {/* Sticky quiz CTA */}
      <button
        onClick={() => setQuizOpen(true)}
        className="fixed bottom-24 right-5 z-20 hidden sm:inline-flex h-12 items-center gap-2 rounded-full border border-mint/60 bg-card px-5 text-sm font-semibold text-mint shadow-lg hover:bg-mint/10"
      >
        <Sparkles className="h-4 w-4" /> Where do I start?
      </button>
      <div className="px-4 pb-12 sm:hidden">
        <button onClick={() => setQuizOpen(true)} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-mint/60 text-sm font-semibold text-mint">
          <Sparkles className="h-4 w-4" /> Where do I start?
        </button>
      </div>

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
    </Layout>
  );
}

function CourseCard({ course, progressOverride }: { course: Course; progressOverride?: number }) {
  const progress = progressOverride ?? course.progress_percent;
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}
      className="card-surface card-surface-hover p-5"
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium">
          <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[course.level_label]}`} />
          {course.level_label}
        </span>
        <span className="text-[11px] text-muted-foreground">{course.duration_hours}h · {course.lesson_count} lessons</span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold leading-tight">{course.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{course.description}</p>
      <div className="mt-3 text-xs text-muted-foreground">Taught with {course.mentor_name}</div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full bg-mint"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <button className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md border border-card-border text-sm font-semibold hover:border-mint/60 hover:text-mint">
        See course
      </button>
    </motion.article>
  );
}

// ──────────────────────────────────────────────────────────
// Quiz

const QUIZ_Q = [
  { key: "q1" as const, title: "Have you ever written any code?", options: [{ v: "yes", label: "Yes" }, { v: "a-bit", label: "A tiny bit" }, { v: "what", label: "What's code?" }] },
  { key: "q2" as const, title: "What do you want to do?", options: [{ v: "job", label: "Get a job in tech" }, { v: "make", label: "Make something" }, { v: "curious", label: "Just curious" }] },
  { key: "q3" as const, title: "How much time do you have each week?", options: [{ v: "thirty", label: "30 mins or less" }, { v: "few-hours", label: "A few hours" }, { v: "all-in", label: "I'm going all in" }] },
] as const;

function recommend(a: QuizAnswers): { title: string; reason: string; courseIds: string[] } {
  const { q1, q2 } = a;
  if (q1 === "yes" && q2 === "job") return { title: "You're closer than you think.", reason: "You've coded before and you want a job — go deep on Python and ship a React project.", courseIds: ["c6", "c5"] };
  if (q1 === "yes" && q2 === "make") return { title: "Build mode.", reason: "You can code and you want to make stuff — design with Figma, then put it on the web.", courseIds: ["c3", "c1"] };
  if (q1 === "a-bit" && q2 === "job") return { title: "Solid starting point.", reason: "A bit of code plus a job goal — pick up Python, then ship your first real site.", courseIds: ["c5", "c1"] };
  if (q1 === "a-bit" && q2 === "make") return { title: "Maker's path.", reason: "Design first, then layer in editing skills you can use anywhere.", courseIds: ["c3", "c4"] };
  if (q1 === "what") return { title: "Start from zero — properly.", reason: "Two short paths that don't assume you know anything. Build a site, learn AI tools.", courseIds: ["c1", "c2"] };
  if (q2 === "curious") return { title: "Curious is a great place to start.", reason: "AI changes everything you do — and a website is the first thing you can show people.", courseIds: ["c2", "c1"] };
  return { title: "A safe starting pair.", reason: "Two paths that complement each other for most people.", courseIds: ["c1", "c2"] };
}

function QuizModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { quiz, setQuiz, startCourse } = useBridgeStore();
  const [step, setStep] = useState(0);
  const [local, setLocal] = useState<QuizAnswers>(quiz);

  const isResult = step === QUIZ_Q.length;
  const rec = isResult ? recommend(local) : null;
  const recCourses = rec ? COURSES.filter((c) => rec.courseIds.includes(c.id)) : [];

  const reset = () => { setLocal({}); setStep(0); };
  const close = () => { onClose(); setStep(0); };

  const pick = (k: keyof QuizAnswers, v: string) => {
    const next = { ...local, [k]: v } as QuizAnswers;
    setLocal(next);
    setTimeout(() => setStep((s) => s + 1), 180);
  };

  const finish = () => {
    setQuiz(local);
    recCourses.forEach((c) => startCourse(c.id));
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-50 bg-black/60" />
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-card-border bg-card shadow-2xl"
            role="dialog" aria-modal="true"
          >
            <header className="flex items-center justify-between border-b border-card-border px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {!isResult ? (
                  <>{step > 0 && (
                    <button onClick={() => setStep(step - 1)} aria-label="Back" className="-ml-2 h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2"><ArrowLeft className="h-4 w-4" /></button>
                  )}
                    <span>{step + 1} of {QUIZ_Q.length}</span></>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-mint"><Sparkles className="h-4 w-4" /> Your path</span>
                )}
              </div>
              <button onClick={close} aria-label="Close" className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2"><X className="h-4 w-4" /></button>
            </header>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {!isResult ? (
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <h2 className="font-display text-xl font-bold leading-snug">{QUIZ_Q[step].title}</h2>
                    <div className="mt-5 space-y-2">
                      {QUIZ_Q[step].options.map((o) => {
                        const active = (local as any)[QUIZ_Q[step].key] === o.v;
                        return (
                          <button
                            key={o.v}
                            onClick={() => pick(QUIZ_Q[step].key, o.v)}
                            className={`w-full rounded-md border px-4 py-4 text-left text-base font-medium transition-colors ${
                              active ? "border-mint bg-mint/10 text-foreground" : "border-card-border bg-background hover:border-mint/40"
                            }`}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : rec && (
                  <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <h2 className="font-display text-2xl font-extrabold leading-tight">{rec.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{rec.reason}</p>
                    <div className="mt-5 space-y-3">
                      {recCourses.map((c) => (
                        <div key={c.id} className="rounded-md border border-card-border p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-display text-base font-bold">{c.title}</div>
                              <div className="mt-1 text-xs text-muted-foreground">{c.duration_hours}h · {c.lesson_count} lessons · {c.level_label}</div>
                            </div>
                            <span className={`h-2 w-2 rounded-full ${LEVEL_DOT[c.level_label]}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={finish} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-mint text-sm font-semibold text-mint-foreground">
                      Start Learning <ArrowRight className="h-4 w-4" />
                    </button>
                    <button onClick={reset} className="mt-2 inline-flex h-10 w-full items-center justify-center text-xs text-muted-foreground hover:text-foreground">
                      Retake quiz
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
