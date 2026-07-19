import Container from "@/components/container";
import { Newsletter } from "@/components/ui/newsletter";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "@tanstack/react-router";

const pageLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Feature", href: "/feature" },
  { title: "Blog", href: "/blog" },
  { title: "Pricing", href: "/pricing" },
  { title: "Integration", href: "/integration" },
  { title: "Contact", href: "/contact" }
];

const innerLinks = [
  { title: "Pricing single", href: "/pricing/starter" },
  { title: "Blog single", href: "/blog/travel-ticketing" },
  { title: "Integration single", href: "/integration/ledgerlink" }
];

const utilityLinks = [
  { title: "Early Access", href: "/early-access" },
  { title: "Cookie policy", href: "/legal/cookie-policy" },
  { title: "404", href: "/404" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/", label: "Instagram" },
  { icon: Twitter, href: "https://x.com/", label: "X" },
  { icon: Linkedin, href: "https://www.linkedin.com/", label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-20">
          {/* Left Column: Newsletter & Logo */}
          <div className="space-y-16">
            <div className="space-y-6">
              <h3 className="text-[20px] font-medium leading-[140%] tracking-[-0.02em]">
                Recevez les nouveautés DolaPay
              </h3>
              <Newsletter
                className="max-w-[420px]"
                placeholder="Enter Your Email"
              />
            </div>

            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/images/common/logo.png"
                alt="DolaPay"
                className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
              <span className="text-xl font-semibold tracking-tight">DolaPay</span>
            </Link>
          </div>

          {/* Right Column: Links */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div>
              <h4 className="font-semibold text-white mb-6">Pages</h4>
              <ul className="space-y-4">
                {pageLinks.map((link) => (
                  <li key={link.title}>
                    <Link to={link.href} className="text-white/70 hover:text-white transition-colors text-[16px]">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Inner Pages</h4>
              <ul className="space-y-4">
                {innerLinks.map((link) => (
                  <li key={link.title}>
                    <Link to={link.href} className="text-white/70 hover:text-white transition-colors text-[16px]">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Utility Pages</h4>
              <ul className="space-y-4">
                {utilityLinks.map((link) => (
                  <li key={link.title}>
                    <Link to={link.href} className="text-white/70 hover:text-white transition-colors text-[16px]">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-muted-foreground text-sm text-center md:text-left md:max-w-none max-w-xs">
            © {new Date().getFullYear()} DolaPay — dola-pay.com. Tous droits réservés.
            {" — "}
            <Link to="/legal/terms-&-condition" className="text-white/70 hover:text-white transition-colors">Conditions d'utilisation</Link>
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/70 hover:text-white"
                aria-label={social.label || "Social Link"}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

