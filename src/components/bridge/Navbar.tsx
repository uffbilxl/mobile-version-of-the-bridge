import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useBridgeStore } from "@/store/useBridgeStore";

const links = [
  { to: "/devices", label: "Devices" },
  { to: "/learn", label: "Learn" },
  { to: "/mentors", label: "Mentors" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const setChatOpen = useBridgeStore((s) => s.setChatOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-tight text-gradient">
          Bridge
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => setChatOpen(true)}
            className="orbit-halo inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-sm font-medium text-violet transition-colors hover:bg-brand/20"
          >
            <span className="orbit-dot" />
            <Sparkles className="h-3.5 w-3.5" /> Ask Bridge
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</button>
        </nav>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-display text-2xl font-extrabold text-gradient">Bridge</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="h-11 w-11 inline-flex items-center justify-center">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 pt-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-4 text-2xl font-display font-bold"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); setChatOpen(true); }}
              className="mt-3 rounded-md px-3 py-4 text-left text-2xl font-display font-bold text-violet"
            >
              Ask Bridge
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
