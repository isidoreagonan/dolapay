import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { createBrowserHistory } from "@tanstack/react-router";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes de cache
        refetchOnWindowFocus: false, // Empêche le rechargement lors des changements d'onglet
        retry: 1,
      },
    },
  });

  const isServer = typeof window === 'undefined';
  
  let customHistory;
  if (!isServer) {
    const rawHistory = createBrowserHistory();
    
    const maskPath = (path: string) => {
      const hn = window.location.hostname;
      if (hn.startsWith('docs') && path.startsWith('/developers')) {
        return path.replace('/developers', '') || '/';
      }
      if (hn.startsWith('dashboard') && path.startsWith('/dashboard')) {
        return path.replace('/dashboard', '') || '/';
      }
      return path;
    };

    const unmaskPath = (path: string) => {
      const hn = window.location.hostname;
      if (hn.startsWith('docs') && !path.startsWith('/developers')) {
        return '/developers' + (path === '/' ? '' : path);
      }
      if (hn.startsWith('dashboard') && !path.startsWith('/dashboard')) {
        return '/dashboard' + (path === '/' ? '' : path);
      }
      return path;
    };

    customHistory = {
      ...rawHistory,
      get location() {
        const loc = rawHistory.location;
        return {
          ...loc,
          pathname: unmaskPath(loc.pathname),
          href: unmaskPath(loc.href),
        };
      },
      listen: (cb: any) => {
        return rawHistory.listen((update: any) => {
          cb({
            ...update,
            location: {
              ...update.location,
              pathname: unmaskPath(update.location.pathname),
              href: unmaskPath(update.location.href),
            }
          });
        });
      },
      push: (path: string, state?: any) => rawHistory.push(maskPath(path), state),
      replace: (path: string, state?: any) => rawHistory.replace(maskPath(path), state),
      createHref: (path: string) => maskPath(rawHistory.createHref(path)),
    };
  }

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    ...(customHistory ? { history: customHistory } : {}),
  });

  return router;
};
