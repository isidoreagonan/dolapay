import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import SiteNav from './site/site-nav'
import SiteFooter from './site/site-footer'

const ScrollToTop = () => {
    const { pathname } = useLocation()
    useEffect(() => { window.scrollTo(0, 0) }, [pathname])
    return null
}

const Layout = ({ children }: { children: React.ReactNode }) => (
    <main className="min-h-screen bg-background text-navy">
        <ScrollToTop />
        <SiteNav />
        <div className="pt-24">{children}</div>
        <SiteFooter />
    </main>
)

export default Layout
