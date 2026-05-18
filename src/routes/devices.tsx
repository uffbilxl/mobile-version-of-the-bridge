import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Laptop, Tablet, Wifi, Smartphone, MapPin, ShieldCheck, X, Check } from "lucide-react";
import { Layout } from "@/components/bridge/Layout";
import { useBridgeStore } from "@/store/useBridgeStore";
import { DEVICES, devicesForPostcode, UK_POSTCODE_REGEX, type Device, type AvailabilityType } from "@/lib/mockData";
import { useMagnetic } from "@/hooks/useMagnetic";
import { celebrate } from "@/lib/confetti";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Find a device — Bridge" },
      { name: "description", content: "Enter your postcode and find a free or loaned laptop, tablet, phone, or broadband near you." },
      { property: "og:title", content: "Find a device — Bridge" },
      { property: "og:description", content: "Free or loaned tech near you. Bridge matches devices to your UK postcode." },
    ],
  }),
  component: DevicesPage,
});

const FILTERS = ["All", "Laptops", "Tablets", "Broadband", "Mobiles"] as const;
const CATEGORY_MAP: Record<string, Device["category"] | null> = {
  All: null, Laptops: "Laptop", Tablets: "Tablet", Broadband: "Broadband", Mobiles: "Mobile",
};

const ICONS = { Laptop, Tablet, Broadband: Wifi, Mobile: Smartphone } as const;

const BADGE_STYLES: Record<AvailabilityType, string> = {
  "Free to keep": "bg-mint text-mint-foreground",
  "3-month loan": "bg-amber text-background",
  "Collect today": "bg-blue text-white",
  "Notify me": "bg-surface-2 text-muted-foreground",
};

function DevicesPage() {
  const { postcode, setPostcode, deviceFilter, setDeviceFilter } = useBridgeStore();
  const [pcError, setPcError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Device | null>(null);
  const onMag = useMagnetic();

  const matched = useMemo(() => {
    if (!postcode) return [];
    return devicesForPostcode(postcode);
  }, [postcode]);

  const displayed = useMemo(() => {
    const list = postcode ? matched : DEVICES;
    const cat = CATEGORY_MAP[deviceFilter];
    return cat ? list.filter((d) => d.category === cat) : list;
  }, [postcode, matched, deviceFilter]);

  const onPostcodeChange = (v: string) => {
    setPostcode(v);
    if (v && !UK_POSTCODE_REGEX.test(v.trim()) && v.length > 3) {
      setPcError("That doesn't look right. Try something like M1 4AF.");
    } else {
      setPcError(null);
    }
  };

  return (
    <Layout>
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Find a device.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Enter your postcode. We'll show you what's near you and what you can pick up — usually within days.
          </p>

          <div className="mt-8 max-w-md">
            <label htmlFor="postcode" className="block text-sm font-medium">Your postcode</label>
            <input
              id="postcode"
              value={postcode}
              onChange={(e) => onPostcodeChange(e.target.value)}
              placeholder="Enter your postcode, e.g. M1 4AF"
              className="mt-2 h-12 w-full rounded-md border border-card-border bg-card px-4 text-base outline-none focus:border-brand/60"
              aria-invalid={!!pcError}
              aria-describedby={pcError ? "pc-err" : undefined}
            />
            {pcError && <p id="pc-err" className="mt-2 text-sm text-amber">{pcError}</p>}
            {!postcode && <p className="mt-2 text-sm text-muted-foreground">Enter your postcode to see what's near you.</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Filter pills */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setDeviceFilter(f)}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                deviceFilter === f
                  ? "border-brand bg-grad-primary text-white"
                  : "border-card-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty / no postcode */}
        {!postcode && (
          <div className="mt-8 rounded-lg border border-dashed border-card-border p-8 text-center">
            <p className="text-sm text-muted-foreground">All devices below — pop your postcode in above to filter to what's near you.</p>
          </div>
        )}

        {/* Cards */}
        <motion.div
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {displayed.map((d) => {
            const Icon = ICONS[d.category];
            return (
              <motion.div
                key={d.id}
                layout
                onMouseMove={onMag}
                variants={{
                  hidden: { y: 30, opacity: 0, scale: 0.97 },
                  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } },
                }}
                className="card-surface card-surface-hover flex flex-col p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-2 text-violet">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE_STYLES[d.availability_type]}`}>
                    {d.availability_type}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold leading-tight">{d.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.specs}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{d.available_nationally ? "UK-wide · posted" : `${d.distance_miles} mi · ${d.hub_name}`}</span>
                  <span className="inline-flex items-center gap-1 text-violet"><ShieldCheck className="h-3 w-3" /> Verified</span>
                </div>
                <button
                  onClick={() => setSelected(d)}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-grad-primary text-sm font-semibold text-white"
                >
                  Request this
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {postcode && displayed.length === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-card-border p-8 text-center">
            <p className="text-sm">Nothing near <strong>{postcode}</strong> in that category right now.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different filter — or leave your email and we'll notify you.</p>
          </div>
        )}

        <div className="mt-10 flex flex-col items-start gap-3 rounded-lg border border-card-border bg-card/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-display text-lg font-bold">Have a device to donate?</div>
            <p className="text-sm text-muted-foreground">A spare laptop changes someone's whole year.</p>
          </div>
          <button className="inline-flex h-11 items-center justify-center rounded-md border border-brand/60 px-5 text-sm font-semibold text-violet hover:bg-brand/10">
            Donate a device →
          </button>
        </div>
      </section>

      <RequestModal device={selected} onClose={() => setSelected(null)} />
    </Layout>
  );
}

function RequestModal({ device, onClose }: { device: Device | null; onClose: () => void }) {
  const [form, setForm] = useState({ first_name: "", email: "", postcode: "", message: "", consent: false });
  const [submitted, setSubmitted] = useState(false);
  const postcode = useBridgeStore((s) => s.postcode);

  // initialise postcode when modal opens
  if (device && !form.postcode && postcode) form.postcode = postcode;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.email || !form.consent) return;
    setSubmitted(true);
  };

  useEffect(() => { if (submitted) celebrate(); }, [submitted]);

  const close = () => {
    setSubmitted(false);
    setForm({ first_name: "", email: "", postcode: "", message: "", consent: false });
    onClose();
  };

  return (
    <AnimatePresence>
      {device && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60" />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-card-border bg-card p-6 shadow-2xl"
            role="dialog" aria-modal="true"
          >
            <button onClick={close} aria-label="Close" className="absolute right-3 top-3 h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2"><X className="h-4 w-4" /></button>

            {!submitted ? (
              <>
                <h2 className="font-display text-xl font-bold">Request {device.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">No payment, no catch.</p>
                <form onSubmit={submit} className="mt-5 space-y-3">
                  <Field label="First name" id="fn">
                    <input id="fn" required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                  </Field>
                  <Field label="Email" id="em">
                    <input id="em" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                  </Field>
                  <Field label="Postcode" id="pc">
                    <input id="pc" required value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                      className="h-11 w-full rounded-md border border-card-border bg-background px-3 outline-none focus:border-brand/60" />
                  </Field>
                  <Field label="Why do you need it? (optional)" id="msg">
                    <textarea id="msg" rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-md border border-card-border bg-background p-3 outline-none focus:border-brand/60" />
                  </Field>
                  <label className="flex gap-2 text-sm">
                    <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1" />
                    <span className="text-muted-foreground">I'm happy for Bridge and the donor hub to contact me about this request.</span>
                  </label>
                  <button type="submit" disabled={!form.consent || !form.first_name || !form.email}
                    className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-md bg-grad-primary text-sm font-semibold text-white disabled:opacity-40">
                    Send request
                  </button>
                </form>
              </>
            ) : (
              <div className="py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-violet">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold">You're all set.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your <strong className="text-foreground">{device.name}</strong> is reserved at <strong className="text-foreground">{device.hub_name}</strong>.
                  Open weekdays 9am–6pm. We'll email collection details to <strong className="text-foreground">{form.email}</strong>.
                </p>
                <button onClick={close} className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-card-border px-6 text-sm font-medium">Done</button>
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
