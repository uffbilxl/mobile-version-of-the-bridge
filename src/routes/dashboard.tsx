import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  Laptop,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  Clock,
  LogOut,
  Save,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Layout } from "@/components/bridge/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — Bridge" },
      { name: "description", content: "Your learning progress, booked mentor sessions, device requests, and profile." },
    ],
  }),
  component: DashboardPage,
});

type CourseRow = { id: string; course_id: string; course_title: string; progress_percent: number };
type SessionRow = { id: string; mentor_name: string; slot: string; status: string; created_at: string };
type DeviceRow = { id: string; device_name: string; hub_name: string | null; status: string; created_at: string };

function DashboardPage() {
  const { user, profile, loading: authLoading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [c, s, d] = await Promise.all([
        supabase.from("user_courses").select("id, course_id, course_title, progress_percent").order("updated_at", { ascending: false }),
        supabase.from("mentor_sessions").select("id, mentor_name, slot, status, created_at").order("created_at", { ascending: false }),
        supabase.from("device_requests").select("id, device_name, hub_name, status, created_at").order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      setCourses((c.data as CourseRow[]) ?? []);
      setSessions((s.data as SessionRow[]) ?? []);
      setDevices((d.data as DeviceRow[]) ?? []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-violet" />
        </div>
      </Layout>
    );
  }

  const name = profile?.display_name || user.email?.split("@")[0] || "there";

  return (
    <Layout>
      <section className="border-b border-card-border bg-grad-hero">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-violet">Your dashboard</div>
            <h1 className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">Hi {name}.</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Everything you've started — in one place. Pick up where you left off.
            </p>
          </div>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="inline-flex h-11 items-center gap-2 self-start rounded-md border border-card-border bg-card px-4 text-sm font-medium hover:border-brand/60 hover:text-violet"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <DashboardCard
          icon={GraduationCap}
          title="My learning"
          empty="No courses saved yet."
          emptyCta={{ to: "/learn", label: "Browse courses →" }}
          loading={loading}
        >
          {courses.map((c) => (
            <Row key={c.id} title={c.course_title} sub={`${c.progress_percent}% complete`}>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress_percent}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-violet"
                />
              </div>
            </Row>
          ))}
        </DashboardCard>

        <DashboardCard
          icon={Users}
          title="Mentor sessions"
          empty="No sessions booked yet."
          emptyCta={{ to: "/mentors", label: "Find a mentor →" }}
          loading={loading}
        >
          {sessions.map((s) => (
            <Row key={s.id} title={s.mentor_name} sub={s.slot}>
              <StatusBadge status={s.status} />
            </Row>
          ))}
        </DashboardCard>

        <DashboardCard
          icon={Laptop}
          title="Device requests"
          empty="No device requests yet."
          emptyCta={{ to: "/devices", label: "Find a device →" }}
          loading={loading}
        >
          {devices.map((d) => (
            <Row key={d.id} title={d.device_name} sub={d.hub_name ?? "Posted to you"}>
              <StatusBadge status={d.status} />
            </Row>
          ))}
        </DashboardCard>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-2 sm:px-6">
        <BookingCalendar sessions={sessions} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <ProfileEditor onSaved={refreshProfile} />
      </section>
    </Layout>
  );
}

function parseSlotDate(slot: string): Date | null {
  // Stored as "YYYY-MM-DD HH:mm — Friendly label"
  const m = slot.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
  if (!m) return null;
  try { return parseISO(`${m[1]}T${m[2]}:00`); } catch { return null; }
}

function BookingCalendar({ sessions }: { sessions: SessionRow[] }) {
  const bookings = sessions
    .map((s) => ({ session: s, date: parseSlotDate(s.slot) }))
    .filter((b): b is { session: SessionRow; date: Date } => b.date !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const [selected, setSelected] = useState<Date | undefined>(bookings[0]?.date);
  const bookedDays = bookings.map((b) => b.date);
  const dayBookings = selected
    ? bookings.filter((b) => isSameDay(b.date, selected))
    : [];

  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 text-violet">
          <CalendarDays className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base font-bold">Your calendar</h2>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[auto,1fr]">
        <div className="rounded-md border border-card-border bg-background p-2">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            modifiers={{ booked: bookedDays }}
            modifiersClassNames={{ booked: "relative font-semibold text-violet after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-violet" }}
            className="p-3 pointer-events-auto"
          />
        </div>

        <div>
          <div className="text-sm font-medium">
            {selected ? format(selected, "EEEE d MMMM yyyy") : "Pick a date"}
          </div>
          <div className="mt-3 space-y-2">
            {dayBookings.length === 0 ? (
              <div className="rounded-md border border-dashed border-card-border p-4 text-sm text-muted-foreground">
                Nothing booked on this day.
              </div>
            ) : (
              dayBookings.map(({ session, date }) => (
                <div key={session.id} className="rounded-md border border-card-border bg-background/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{session.mentor_name}</div>
                      <div className="text-xs text-muted-foreground">30-min session · {format(date, "HH:mm")}</div>
                    </div>
                    <StatusBadge status={session.status} />
                  </div>
                </div>
              ))
            )}
          </div>
          {bookings.length > 0 && (
            <div className="mt-4 text-xs text-muted-foreground">
              {bookings.length} upcoming {bookings.length === 1 ? "booking" : "bookings"} · dots show booked days
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  empty,
  emptyCta,
  loading,
  children,
}: {
  icon: typeof GraduationCap;
  title: string;
  empty: string;
  emptyCta: { to: "/learn" | "/mentors" | "/devices"; label: string };
  loading: boolean;
  children: React.ReactNode;
}) {
  const arr = Array.isArray(children) ? children : [children];
  const hasItems = arr.some(Boolean) && arr.length > 0 && (Array.isArray(children) ? children.length > 0 : true);

  return (
    <article className="card-surface flex flex-col p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 text-violet">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base font-bold">{title}</h2>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : hasItems ? (
          children
        ) : (
          <div className="rounded-md border border-dashed border-card-border p-4 text-sm text-muted-foreground">
            {empty}{" "}
            <Link to={emptyCta.to} className="font-medium text-violet hover:underline">{emptyCta.label}</Link>
          </div>
        )}
      </div>
    </article>
  );
}

function Row({ title, sub, children }: { title: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-card-border bg-background/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const isDone = ["confirmed", "ready", "delivered"].includes(lower);
  return (
    <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
      isDone ? "bg-mint/15 text-mint" : "bg-surface-2 text-muted-foreground"
    }`}>
      {isDone ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
      {status}
    </div>
  );
}

function ProfileEditor({ onSaved }: { onSaved: () => Promise<void> }) {
  const { profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [postcode, setPostcode] = useState(profile?.postcode ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [role, setRole] = useState<"learner" | "mentor" | "both">(profile?.role ?? "learner");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setPostcode(profile?.postcode ?? "");
    setBio(profile?.bio ?? "");
    setAvatarUrl(profile?.avatar_url ?? "");
    setRole(profile?.role ?? "learner");
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        postcode: postcode.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        role,
      })
      .eq("user_id", profile.user_id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile saved.");
      await onSaved();
    }
  };

  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 text-violet">
          <UserIcon className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base font-bold">Your profile</h2>
      </div>

      <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input label="Display name" value={displayName} onChange={setDisplayName} maxLength={80} />
        <Input label="Postcode" value={postcode} onChange={setPostcode} maxLength={10} placeholder="e.g. M1 4AF" />
        <Input label="LinkedIn URL" value={avatarUrl} onChange={setAvatarUrl} maxLength={500} placeholder="https://linkedin.com/in/…" />
        <div>
          <label className="mb-1.5 block text-sm font-medium">I'm here as</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "learner" | "mentor" | "both")}
            className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60"
          >
            <option value="learner">A learner</option>
            <option value="mentor">A mentor</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="A line or two about you."
            className="w-full rounded-md border border-card-border bg-background p-3 text-sm outline-none focus:border-brand/60"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-grad-primary px-5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save profile
          </button>
        </div>
      </form>
    </article>
  );
}

function Input({
  label, value, onChange, maxLength, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; maxLength?: number; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60"
      />
    </div>
  );
}