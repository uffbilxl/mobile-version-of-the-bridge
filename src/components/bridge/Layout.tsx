import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AIGuide } from "./AIGuide";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIGuide />
    </div>
  );
}
