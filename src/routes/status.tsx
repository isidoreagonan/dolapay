import { Outlet, createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Activity } from 'lucide-react';
import { ThemeProvider } from 'next-themes';

export const Route = createFileRoute('/status')({
  component: StatusLayout,
});

function StatusLayout() {
  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30 font-sans relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à DolaPay
              </Link>
              
              <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                <Activity className="w-5 h-5 text-primary" />
                DolaPay <span className="text-white/50 font-normal">Status</span>
              </div>
              
              <div className="w-[110px]">{/* Spacer for centering */}</div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 container mx-auto px-4 py-12">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/20 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center flex flex-col items-center gap-4">
              <p className="text-sm text-white/40">
                Les statuts sont mis à jour en temps réel via l'API officielle de nos partenaires.
              </p>
              <div className="text-xs text-white/30">
                &copy; {new Date().getFullYear()} DolaPay. Tous droits réservés.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
