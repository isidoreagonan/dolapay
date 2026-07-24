import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

import appCss from "../styles.css?url";
import logoIcon from "@/assets/dolapay-icon.png.asset.json";
import logoFull from "@/assets/dolapay-logo.png.asset.json";

if (typeof window !== "undefined") {
  const hn = window.location.hostname;
  const path = window.location.pathname;
  const isProd = hn.includes("dola-pay.com");
  const isDashboardPath = path.startsWith("/dashboard") || path.startsWith("/auth");
  
  if (isProd && isDashboardPath && !hn.startsWith("dashboard")) {
    const cleanPath = path.startsWith("/dashboard") ? path.replace("/dashboard", "") : path;
    const target = `https://dashboard.dola-pay.com${cleanPath === "" ? "/" : cleanPath}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
  }
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    // Error logged to console
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n'a pas pu être chargée
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Un problème est survenu de notre côté. Essayez de rafraîchir ou revenez à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DolaPay — Encaissez facilement vos clients partout en Afrique" },
      { name: "description", content: "Vendez sur les réseaux sociaux avec nos liens de paiement, ou intégrez notre API sur votre site. Acceptez le Mobile Money et les cartes bancaires sans effort." },
      { name: "keywords", content: "agrégateur de paiement Afrique, API paiement mobile money Afrique, passerelle de paiement Afrique, intégration mobile money API, accepter paiement mobile money site web, API paiement Mobile Money Orange Money MTN, solution de paiement e-commerce Afrique, passerelle paiement Bénin, passerelle paiement Côte d'Ivoire, passerelle paiement Sénégal, alternative à Stripe pour l'Afrique, accepter paiement FCFA en ligne, solution paiement diaspora africaine, mobile money payment API Africa, payment aggregator Africa, accept mobile money payments online, Africa payment gateway API, mobile money integration for developers, collect payments across Africa API, best payment API for African startups, Stripe alternative for Africa" },
      { name: "author", content: "DolaPay" },
      { name: "google-site-verification", content: "AMPu5aOAwc5zNXRYuXsKvoPx-EzDtJDBYlQMuNIaYfs" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "DolaPay — Encaissez facilement vos clients partout en Afrique" },
      { property: "og:description", content: "Vendez sur les réseaux sociaux avec nos liens de paiement, ou intégrez notre API sur votre site. Acceptez le Mobile Money et les cartes bancaires sans effort." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dola-pay.com" },
      { property: "og:image", content: "https://dola-pay.com/og-image.png" },
      { name: "twitter:image", content: "https://dola-pay.com/og-image.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: logoIcon.url },
      { rel: "apple-touch-icon", href: logoIcon.url },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        {/* Start of Tawk.to Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6a5e194a1a1df41d5c17845d/1jtvp5ja4';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`,
          }}
        />
        {/* End of Tawk.to Script */}
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const location = useLocation();
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    import("@/integrations/supabase/client").then(({ supabase }) => {
      if (!mounted) return;
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          lastUserIdRef.current = null;
          queryClient.clear();
          router.invalidate();
          return;
        }

        const newUserId = session?.user?.id || null;
        if (newUserId && newUserId !== lastUserIdRef.current) {
          lastUserIdRef.current = newUserId;
          if (event === "SIGNED_IN") {
            router.invalidate();
            // Redirection automatique vers le dashboard si on est sur la landing page ou les pages d'auth
            const path = window.location.pathname;
            if (path === "/" || path.startsWith("/auth")) {
              router.navigate({ to: "/dashboard" });
            }
          }
        }
      });
      (window as unknown as { __sbSub?: { unsubscribe: () => void } }).__sbSub =
        sub.subscription;
    });
    return () => {
      mounted = false;
    };
  }, [queryClient, router]);

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isStatus = location.pathname.startsWith("/status");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
        forcedTheme={(!isDashboard && !isStatus) ? "light" : undefined}
      >
        <Outlet />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
