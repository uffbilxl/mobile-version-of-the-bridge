import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/bridge/Layout";
import { adminLogin, adminGetAll } from "@/lib/admin.functions";

const STORAGE_KEY = "bridge-admin-creds";

type Creds = { username: string; password: string };

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Bridge" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [creds, setCreds] = useState<Creds | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setCreds(JSON.parse(raw)); } catch { /* noop */ }
    }
  }, []);

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {!creds ? (
          <AdminLogin onAuthed={(c) => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c));
            setCreds(c);
          }} />
        ) : (
          <AdminDashboard
            creds={creds}
            onLogout={() => {
              sessionStorage.removeItem(STORAGE_KEY);
              setCreds(null);
            }}
          />
        )}
      </section>
    </Layout>
  );
}

function AdminLogin({ onAuthed }: { onAuthed: (c: Creds) => void }) {
  const login = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login({ data: { username, password } });
      onAuthed({ username, password });
      toast.success("Welcome, admin.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-card-border bg-card p-6 shadow-2xl">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-violet" />
        <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Demo credentials: <code>admin</code> / <code>admin</code></p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60"
          />
        </div>
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-grad-primary text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}

type AllData = Awaited<ReturnType<typeof adminGetAll>>;

function AdminDashboard({ creds, onLogout }: { creds: Creds; onLogout: () => void }) {
  const getAll = useServerFn(adminGetAll);
  const [data, setData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAll({ data: creds });
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [creds, getAll]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading admin data…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
        {error ?? "No data"}
      </div>
    );
  }

  const profileNameById = new Map(
    data.profiles.map((p) => [p.user_id, p.display_name ?? "—"]),
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">All registrations, mentor applications, and bookings.</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-card-border bg-card px-4 text-sm font-medium hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Registered users" value={data.profiles.length} />
        <Stat label="Mentor applications" value={data.applications.length} />
        <Stat label="Mentor bookings" value={data.sessions.length} />
        <Stat label="Device requests" value={data.devices.length} />
        <Stat label="Course enrolments" value={data.courses.length} />
      </div>

      <Section title={`Registered users (${data.profiles.length})`}>
        <DataTable
          headers={["Name", "Role", "Postcode", "Bio", "Joined"]}
          rows={data.profiles.map((p) => [
            p.display_name ?? "—",
            p.role ?? "—",
            p.postcode ?? "—",
            truncate(p.bio),
            fmtDate(p.created_at),
          ])}
          empty="No users yet."
        />
      </Section>

      <Section title={`Mentor applications (${data.applications.length})`}>
        <DataTable
          headers={["Name", "Email", "Role", "Company", "Skills", "Pitch", "Status", "Submitted"]}
          rows={data.applications.map((a) => [
            a.full_name,
            a.email,
            a.applicant_role,
            a.company ?? "—",
            truncate(a.skills, 60),
            truncate(a.pitch, 80),
            a.status,
            fmtDate(a.created_at),
          ])}
          empty="No applications yet."
        />
      </Section>

      <Section title={`Mentor bookings (${data.sessions.length})`}>
        <DataTable
          headers={["User", "Mentor", "Slot", "Message", "Status", "Booked"]}
          rows={data.sessions.map((s) => [
            profileNameById.get(s.user_id) ?? s.user_id.slice(0, 8),
            s.mentor_name,
            s.slot,
            truncate(s.message, 60),
            s.status,
            fmtDate(s.created_at),
          ])}
          empty="No bookings yet."
        />
      </Section>

      <Section title={`Device requests (${data.devices.length})`}>
        <DataTable
          headers={["User", "Device", "Hub", "Status", "Requested"]}
          rows={data.devices.map((d) => [
            profileNameById.get(d.user_id) ?? d.user_id.slice(0, 8),
            d.device_name,
            d.hub_name ?? "—",
            d.status,
            fmtDate(d.created_at),
          ])}
          empty="No device requests yet."
        />
      </Section>

      <Section title={`Course progress (${data.courses.length})`}>
        <DataTable
          headers={["User", "Course", "Progress", "Updated"]}
          rows={data.courses.map((c) => [
            profileNameById.get(c.user_id) ?? c.user_id.slice(0, 8),
            c.course_title,
            `${c.progress_percent}%`,
            fmtDate(c.updated_at),
          ])}
          empty="No course activity yet."
        />
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-semibold">{title}</h2>
      <div className="overflow-hidden rounded-xl border border-card-border bg-card">{children}</div>
    </section>
  );
}

function DataTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: (string | number)[][];
  empty: string;
}) {
  if (rows.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {headers.map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-card-border">
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function truncate(value: string | null | undefined, max = 40) {
  if (!value) return "—";
  return value.length > max ? value.slice(0, max - 1) + "…" : value;
}

function fmtDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}