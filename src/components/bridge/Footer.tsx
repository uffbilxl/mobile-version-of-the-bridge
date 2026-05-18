import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-card-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="font-display text-2xl font-extrabold">Bridge</div>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Built at a hackathon for real impact. In partnership with Centauri — Youth Digital Inclusion.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-2">
              <div className="font-medium text-foreground">Get help</div>
              <Link to="/devices" className="block text-muted-foreground hover:text-foreground">Find a device</Link>
              <Link to="/learn" className="block text-muted-foreground hover:text-foreground">Learn a skill</Link>
              <Link to="/mentors" className="block text-muted-foreground hover:text-foreground">Find a mentor</Link>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">Give back</div>
              <Link to="/devices" className="block text-muted-foreground hover:text-foreground">Donate a device</Link>
              <Link to="/mentors" className="block text-muted-foreground hover:text-foreground">Become a mentor</Link>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">Safety</div>
              <a href="mailto:safe@bridge.example" className="block text-muted-foreground hover:text-foreground">
                Worried about something? Talk to us →
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} Bridge. A Centauri hackathon project.</div>
      </div>
    </footer>
  );
}
