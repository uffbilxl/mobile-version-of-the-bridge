import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Layout } from "@/components/bridge/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Bridge" },
      { name: "description", content: "Sign in or create a free Bridge account to track your learning, devices, and mentor sessions." },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  display_name: z.string().trim().min(1, "Tell us your name").max(80),
});

type Mode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      const parsed = signUpSchema.safeParse({ email, password, display_name: displayName });
      if (!parsed.success) {
        setError(parsed.error.issues[0].message);
        return;
      }
      setBusy(true);
      const { error: err } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { display_name: parsed.data.display_name },
        },
      });
      setBusy(false);
      if (err) {
        setError(err.message);
      } else {
        toast.success("Account created — welcome to Bridge.");
        navigate({ to: "/dashboard" });
      }
      return;
    }

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (err) {
      setError(err.message === "Invalid login credentials" ? "Email or password is wrong." : err.message);
    } else {
      toast.success("Welcome back.");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-grad-hero">
        <div className="mx-auto flex max-w-md flex-col px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
              {mode === "signin" ? "Welcome back." : "Make your Bridge account."}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Pick up where you left off — courses, mentors, devices."
                : "Free, forever. Track learning, sessions, and device requests in one place."}
            </p>
          </motion.div>

          <motion.form
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            onSubmit={submit}
            className="mt-8 rounded-2xl border border-card-border bg-card p-6 shadow-2xl"
          >
            {mode === "signup" && (
              <Field label="Your name" id="dn">
                <input
                  id="dn"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Sam"
                  required
                  maxLength={80}
                  autoComplete="name"
                  className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60"
                />
              </Field>
            )}
            <Field label="Email" id="em">
              <input
                id="em"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                maxLength={255}
                className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60"
              />
            </Field>
            <Field label="Password" id="pw">
              <input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={72}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60"
              />
            </Field>

            {error && (
              <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-grad-primary text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "New to Bridge?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
                className="font-semibold text-violet hover:underline"
              >
                {mode === "signin" ? "Create one" : "Sign in"}
              </button>
            </div>
          </motion.form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to Bridge's friendly, no-spam <Link to="/" className="underline">terms</Link>.
          </p>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 first:mt-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}