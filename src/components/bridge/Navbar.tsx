import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Sparkles, LayoutDashboard } from "lucide-react";
import { useBridgeStore } from "@/store/useBridgeStore";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/devices", label: "Devices" },
  { to: "/learn", label: "Learn" },
  { to: "/mentors", label: "Mentors" },
  { to: "/pathways", label: "Pathways" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const setChatOpen = useBridgeStore((s) => s.setChatOpen);
  const { user, profile } = useAuth();
  const name = profile?.display_name || user?.email?.split("@")[0];

  // Lock body scroll when the mobile menu is open so the page behind doesn't move.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-card-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
            <span className="font-display text-2xl font-extrabold tracking-tight text-gradient">Bridge</span>
            <span className="mt-0.5 text-[10px] font-medium tracking-wide text-violet">powered by Centauri</span>
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
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-card px-3 py-1.5 text-sm font-medium hover:border-brand/60 hover:text-violet"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {name ?? "Dashboard"}
              </Link>
            ) : (
              <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
            )}
          </nav>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-[70] inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu rendered via portal so backdrop-filter on the header
          does not trap its `fixed` positioning inside the 64px header box. */}
      {typeof document !== "undefined" && createPortal(
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-hidden={!open}
          className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-200 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-background"
          />
          <div
            className="relative flex h-full w-full flex-col bg-background"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              paddingRight: "env(safe-area-inset-right)",
            }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-card-border px-4">
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-extrabold text-gradient">Bridge</span>
                <span className="mt-0.5 text-[10px] font-medium tracking-wide text-violet">powered by Centauri</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-card"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-4">
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-4 text-2xl font-display font-bold text-foreground active:bg-card"
                      activeProps={{ className: "text-violet" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => { setOpen(false); setChatOpen(true); }}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-4 text-left text-2xl font-display font-bold text-violet active:bg-card"
                  >
                    <Sparkles className="h-5 w-5" /> Ask Bridge
                  </button>
                </li>
                <li className="mt-4 border-t border-card-border pt-4">
                  {user ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-4 text-2xl font-display font-bold active:bg-card"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      {name ?? "Dashboard"}
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-4 text-2xl font-display font-bold active:bg-card"
                    >
                      Sign in
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
