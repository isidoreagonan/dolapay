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

    const getCrossDomainUrl = (path: string) => {
      const hn = window.location.hostname;
      const isProd = hn.includes('dola-pay.com');
      const baseDomain = isProd ? 'dola-pay.com' : hn.replace('docs.', '').replace('dashboard.', '').replace('status.', '');
      const scheme = hn.includes('localhost') ? 'http://' : 'https://';

      const isDashboardPath = 
        path.startsWith('/dashboard') || 
        path.startsWith('/auth') || 
        path.startsWith('/admin') || 
        path.startsWith('/onboarding') || 
        path.startsWith('/complete-profile') || 
        path.startsWith('/accept-invite');
      const isDocsPath = path.startsWith('/developers');
      const isStatusPath = path.startsWith('/status');
      const isMainPath = !isDashboardPath && !isDocsPath && !isStatusPath;

      if (isDashboardPath && !hn.startsWith('dashboard')) {
        const cleanPath = path.startsWith('/dashboard') ? path.replace('/dashboard', '') : path;
        return `${scheme}dashboard.${baseDomain}${cleanPath === '' ? '/' : cleanPath}`;
      }
      
      if (isDocsPath && !hn.startsWith('docs')) {
        const cleanPath = path.replace('/developers', '');
        return `${scheme}docs.${baseDomain}${cleanPath === '' ? '/' : cleanPath}`;
      }

      if (isStatusPath && !hn.startsWith('status')) {
        const cleanPath = path.replace('/status', '');
        return `${scheme}status.${baseDomain}${cleanPath === '' ? '/' : cleanPath}`;
      }
      
      if (isMainPath && (hn.startsWith('dashboard') || hn.startsWith('docs') || hn.startsWith('status'))) {
        return `${scheme}${baseDomain}${path}`;
      }
      
      return null;
    };
    
    const maskPath = (path: string) => {
      const hn = window.location.hostname;
      if (hn.startsWith('docs') && path.startsWith('/developers')) {
        return path.replace('/developers', '') || '/';
      }
      if (hn.startsWith('dashboard') && path.startsWith('/dashboard')) {
        return path.replace('/dashboard', '') || '/';
      }
      if (hn.startsWith('status') && path.startsWith('/status')) {
        return path.replace('/status', '') || '/';
      }
      return path;
    };

    const unmaskPath = (path: string) => {
      const hn = window.location.hostname;
      if (hn.startsWith('docs') && !path.startsWith('/developers')) {
        return '/developers' + (path === '/' ? '' : path);
      }
      const isDashboardAppNativePath = 
        path.startsWith('/dashboard') || 
        path.startsWith('/auth') || 
        path.startsWith('/admin') || 
        path.startsWith('/onboarding') || 
        path.startsWith('/complete-profile') || 
        path.startsWith('/accept-invite');
        
      if (hn.startsWith('dashboard') && !isDashboardAppNativePath) {
        return '/dashboard' + (path === '/' ? '' : path);
      }
      if (hn.startsWith('status') && !path.startsWith('/status')) {
        return '/status' + (path === '/' ? '' : path);
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
      push: (path: string, state?: any) => {
        const crossDomain = getCrossDomainUrl(path);
        if (crossDomain) {
          window.location.assign(crossDomain);
          return;
        }
        rawHistory.push(maskPath(path), state);
      },
      replace: (path: string, state?: any) => {
        const crossDomain = getCrossDomainUrl(path);
        if (crossDomain) {
          window.location.replace(crossDomain);
          return;
        }
        rawHistory.replace(maskPath(path), state);
      },
      createHref: (path: string) => {
        const crossDomain = getCrossDomainUrl(path);
        if (crossDomain) return crossDomain;
        return maskPath(rawHistory.createHref(path));
      },
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
