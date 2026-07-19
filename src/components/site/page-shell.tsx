import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import SiteNav from "./site-nav";
import SiteFooter from "./site-footer";
import SEO from "@/components/seo";

interface PageShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
  canonicalUrl?: string;
  hideFooter?: boolean;
}

const PageShell = ({ children, title, description, canonicalUrl, hideFooter }: PageShellProps) => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <SEO title={title} description={description} canonicalUrl={canonicalUrl} />
      <div className="min-h-screen bg-background text-navy">
        <SiteNav />
        <div>{children}</div>
        {!hideFooter && <SiteFooter />}
      </div>
    </>
  );
};

export default PageShell;
