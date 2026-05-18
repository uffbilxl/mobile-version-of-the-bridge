import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Check, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { celebrate } from "@/lib/confetti";

const schema = z.object({
  full_name: z.string().trim().min(1, "Add your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  applicant_role: z.string().trim().min(1, "What do you do?").max(120),
  company: z.string().trim().max(120).optional(),
  skills: z.string().trim().min(2, "List a few skills").max(300),
  pitch: z.string().trim().min(20, "A sentence or two please (20+ chars)").max(800),
});

type Form = z.infer<typeof schema>;

const EMPTY: Form = { full_name: "", email: "", applicant_role: "", company: "", skills: "", pitch: "" };

export function MentorApplicationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, profile } = useAuth();
  const [form, setForm] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY,
        full_name: profile?.display_name ?? "",
        email: user?.email ?? "",
      });
      setDone(false);
      setError(null);
    }
  }, [open, user, profile]);

  useEffect(() => { if (done) celebrate(); }, [done]);

  const close = () => { onClose(); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.from("mentor_applications").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      applicant_role: parsed.data.applicant_role,
      company: parsed.data.company || null,
      skills: parsed.data.skills,
      pitch: parsed.data.pitch,
      user_id: user?.id ?? null,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      toast.error("Couldn't submit — try again.");
    } else {
      setDone(true);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-card-border bg-card p-6 shadow-2xl"
            role="dialog" aria-modal="true"
          >
            <button onClick={close} aria-label="Close" className="absolute right-3 top-3 h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2">
              <X className="h-4 w-4" />
            </button>

            {!done ? (
              <>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-2.5 py-1 text-xs font-medium text-violet">
                  <ShieldCheck className="h-3 w-3" /> Become a mentor
                </div>
                <h2 className="mt-3 font-display text-2xl font-extrabold">Give 30 minutes. Change a year.</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We'll review your application and get back to you within a week.
                </p>

                <form onSubmit={submit} className="mt-5 space-y-3">
                  <Field label="Full name" id="fa">
                    <input id="fa" required maxLength={120} value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                  </Field>
                  <Field label="Email" id="em">
                    <input id="em" type="email" required maxLength={255} value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Your role" id="rl">
                      <input id="rl" required maxLength={120} value={form.applicant_role}
                        onChange={(e) => setForm({ ...form, applicant_role: e.target.value })}
                        placeholder="e.g. Frontend Engineer"
                        className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                    </Field>
                    <Field label="Company (optional)" id="co">
                      <input id="co" maxLength={120} value={form.company ?? ""}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. Monzo"
                        className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                    </Field>
                  </div>
                  <Field label="Skills you'd mentor on" id="sk">
                    <input id="sk" required maxLength={300} value={form.skills}
                      onChange={(e) => setForm({ ...form, skills: e.target.value })}
                      placeholder="React, career advice, portfolio reviews…"
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                  </Field>
                  <Field label="Why you want to mentor" id="pi">
                    <textarea id="pi" required minLength={20} maxLength={800} rows={4} value={form.pitch}
                      onChange={(e) => setForm({ ...form, pitch: e.target.value })}
                      placeholder="A few sentences — what you'd bring, what you'd love to share."
                      className="w-full rounded-md border border-card-border bg-background p-3 text-sm outline-none focus:border-brand/60" />
                  </Field>

                  {error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={busy}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-grad-primary text-sm font-semibold text-white disabled:opacity-50">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Submit application
                  </button>
                </form>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-violet">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-extrabold">Thank you.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We've got your application. The Bridge team will be in touch within a week.
                </p>
                <button onClick={close} className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-card-border px-6 text-sm font-medium">
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}