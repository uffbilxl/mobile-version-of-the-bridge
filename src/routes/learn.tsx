import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Check, ArrowRight, ArrowLeft, BookOpen, Clock, MapPin } from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Layout } from "@/components/bridge/Layout";
import { COURSES, COURSE_MODULES, SKILL_PILLS, type Course, type LevelLabel } from "@/lib/mockData";
import { useBridgeStore, type QuizAnswers } from "@/store/useBridgeStore";
import { useMagnetic } from "@/hooks/useMagnetic";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { celebrate } from "@/lib/confetti";

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
  "Know a little": "bg-star",
  "Level up": "bg-violet",
};

const ALL = "All";
const PILLS = [ALL, ...SKILL_PILLS];

function LearnPage() {
  const { skillPill, setSkillPill, courseProgress } = useBridgeStore();
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
                skillPill === p ? "border-brand bg-grad-primary text-white" : "border-card-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <motion.div
          className="mt-8 grid gap-4 md:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {filtered.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              progressOverride={courseProgress[c.id]}
              onSelect={() => setSelectedCourse(c)}
            />
          ))}
        </motion.div>
      </section>

      {/* Sticky quiz CTA */}
      <button
        onClick={() => setQuizOpen(true)}
        className="fixed bottom-24 right-5 z-20 hidden sm:inline-flex h-12 items-center gap-2 rounded-full border border-brand/60 bg-card px-5 text-sm font-semibold text-violet shadow-lg hover:bg-brand/10"
      >
        <Sparkles className="h-4 w-4" /> Where do I start?
      </button>
      <div className="px-4 pb-12 sm:hidden">
        <button onClick={() => setQuizOpen(true)} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-brand/60 text-sm font-semibold text-violet">
          <Sparkles className="h-4 w-4" /> Where do I start?
        </button>
      </div>

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
      <CourseDrawer course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </Layout>
  );
}

function CourseCard({ course, progressOverride, onSelect }: { course: Course; progressOverride?: number; onSelect: () => void }) {
  const progress = progressOverride ?? course.progress_percent;
  const onMag = useMagnetic();
  return (
    <motion.article
      layout
      onMouseMove={onMag}
      variants={{
        hidden: { y: 30, opacity: 0, scale: 0.97 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } },
      }}
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
          className="h-full bg-violet"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <button
        onClick={onSelect}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md border border-card-border text-sm font-semibold hover:border-brand/60 hover:text-violet"
      >
        See course
      </button>
    </motion.article>
  );
}

// ──────────────────────────────────────────────────────────
// Course drawer — overview, modules, and booking

const COURSE_TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00"];

function slotsForCourseDay(courseId: string, date: Date): string[] {
  const seed = (courseId.charCodeAt(1) || 1) + date.getDate() + date.getMonth();
  return COURSE_TIME_SLOTS.filter((_, i) => ((seed + i) % 4) !== 0);
}

function CourseDrawer({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const { startCourse } = useBridgeStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", email: "", message: "" });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const modules = course ? COURSE_MODULES[course.id] ?? [] : [];
  const availableTimes = course && date ? slotsForCourseDay(course.id, date) : [];

  const close = () => {
    setDone(false);
    setForm({ first_name: "", email: "", message: "" });
    setDate(undefined);
    setTime("");
    onClose();
  };

  useEffect(() => { if (done) celebrate(); }, [done]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !form.first_name || !form.email || !date || !time) return;
    if (!user) {
      toast.message("Sign in to book your kickoff session.");
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    const iso = `${format(date, "yyyy-MM-dd")} ${time}`;
    const friendly = `${format(date, "EEE d MMM")} · ${time}`;
    const slotValue = `${iso} — ${friendly}`;

    // Enrol in the course (ignore if already enrolled)
    const { error: ucErr } = await supabase.from("user_courses").insert({
      user_id: user.id,
      course_id: course.id,
      course_title: course.title,
      progress_percent: 8,
    });
    const dupe = ucErr?.code === "23505";
    // Also book a kickoff session with the course mentor so it shows on the dashboard calendar
    const { error: msErr } = await supabase.from("mentor_sessions").insert({
      user_id: user.id,
      mentor_id: `course-${course.id}`,
      mentor_name: `${course.mentor_name} · ${course.title}`,
      slot: slotValue,
      message: form.message || `Kickoff session for ${course.title}`,
      status: "confirmed",
    });
    setBusy(false);
    if ((ucErr && !dupe) || msErr) {
      toast.error((msErr || ucErr)!.message);
      return;
    }
    startCourse(course.id);
    setDone(true);
  };

  return (
    <AnimatePresence>
      {course && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-50 bg-black/60" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto border-l border-card-border bg-card sm:w-[480px]"
            role="dialog" aria-modal="true"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-card-border bg-card px-5 py-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><BookOpen className="h-4 w-4" /> Course</span>
              <button onClick={close} aria-label="Close" className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-surface-2"><X className="h-4 w-4" /></button>
            </header>

            <div className="p-5">
              {!done ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium">
                    <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[course.level_label]}`} />
                    {course.level_label}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight">{course.title}</h2>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {course.duration_hours}h · {course.lesson_count} lessons · Taught with {course.mentor_name}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed">{course.description}</p>

                  <div className="mt-6">
                    <div className="text-sm font-semibold">What you'll learn</div>
                    <ol className="mt-3 space-y-2">
                      {modules.map((m, i) => (
                        <li key={m} className="flex items-start gap-3 rounded-md border border-card-border bg-background/40 p-3">
                          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-grad-primary text-[11px] font-bold text-white">{i + 1}</span>
                          <span className="text-sm leading-snug">{m}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-6 rounded-md border border-card-border bg-surface-2/60 p-4 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-1.5 text-foreground"><MapPin className="h-3.5 w-3.5 text-violet" /> Sessions run at <span className="font-medium">BCU Curzon Building</span></div>
                    <div className="mt-1">4 Cardigan St, Birmingham B4 7BD · or join online</div>
                  </div>

                  <div className="mt-6 text-sm font-semibold">Book your kickoff session</div>
                  <div className="mt-2 rounded-md border border-card-border bg-background p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => { setDate(d); setTime(""); }}
                      disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || d > addDays(new Date(), 30)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </div>

                  {date && (
                    <>
                      <div className="mt-5 text-sm font-medium">
                        Pick a time on {format(date, "EEE d MMM")}
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {availableTimes.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={`h-11 rounded-md border text-sm transition-colors ${time === t ? "border-brand bg-brand/10 text-foreground" : "border-card-border hover:border-brand/40"}`}
                          >
                            {t}
                          </button>
                        ))}
                        {availableTimes.length === 0 && (
                          <div className="col-span-3 text-xs text-muted-foreground">No slots that day — try another.</div>
                        )}
                      </div>
                    </>
                  )}

                  <form onSubmit={submit} className="mt-6 space-y-3">
                    <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name"
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email"
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                    <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What do you want to get out of this course? (optional)"
                      className="w-full rounded-md border border-card-border bg-background p-3 text-sm outline-none focus:border-brand/60" />
                    <button type="submit" disabled={busy || !form.first_name || !form.email || !date || !time}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-grad-primary text-sm font-semibold text-white disabled:opacity-40">
                      {busy ? "Booking…" : user ? "Enrol & confirm session" : "Sign in to enrol"} <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="pt-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-violet"><Check className="h-6 w-6" /></div>
                  <h2 className="mt-4 font-display text-xl font-bold">You're enrolled.</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {course.title} is now in your dashboard. Your kickoff with {course.mentor_name.split(" ")[0]}{date && time ? ` is on ${format(date, "EEE d MMM")} at ${time}` : ""} — a confirmation email is on its way to <span className="text-foreground">{form.email}</span>.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Meet at BCU Curzon Building, 4 Cardigan St, Birmingham B4 7BD — or join online from your dashboard.</p>
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
                  <span className="inline-flex items-center gap-1.5 text-violet"><Sparkles className="h-4 w-4" /> Your path</span>
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
                              active ? "border-brand bg-brand/10 text-foreground" : "border-card-border bg-background hover:border-brand/40"
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
                    <button onClick={finish} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-grad-primary text-sm font-semibold text-white">
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
