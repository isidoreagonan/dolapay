import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-40">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-elegant">
          <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">DolaPay</div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <p className="mt-8 text-sm text-muted-foreground">Cette page fait partie du site DolaPay. Le contenu arrive bientôt.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
