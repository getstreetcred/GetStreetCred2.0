import { Link } from "wouter";
import { Navigation } from "lucide-react";
import { SiX, SiInstagram, SiLinkedin, SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: "Trending Projects", href: "/trending" },
      { label: "Top Rated", href: "/top-rated" },
      { label: "Categories", href: "/categories" },
      { label: "Locations", href: "/locations" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: SiX, href: "https://twitter.com", label: "X" },
    { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: SiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: SiGithub, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" data-testid="link-footer-home">
              <div className="flex items-center gap-2 cursor-pointer mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-primary font-serif">
                    GetStreetCred
                  </span>
                  <span className="text-xs text-muted-foreground -mt-1">
                    Rate the Streets
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Discover and rate the world's most iconic infrastructure projects.
            </p>
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={() => window.open(social.href, "_blank")}
                  data-testid={`button-social-${social.label.toLowerCase()}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-footer-explore">
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-footer-company">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-footer-legal">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            {currentYear} GetStreetCred. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with passion for infrastructure
          </p>
        </div>
      </div>
    </footer>
  );
}
