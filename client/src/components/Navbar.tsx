import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle 
} from "@/components/ui/sheet";
import { Navigation, Menu, X, TrendingUp, Award, Plus } from "lucide-react";

interface NavLink {
  href?: string;
  scrollTo?: string;
  label: string;
  icon: typeof TrendingUp;
}

interface NavbarProps {
  onSignIn?: () => void;
  onJoinNow?: () => void;
}

export default function Navbar({ onSignIn, onJoinNow }: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavLink[] = [
    { scrollTo: "trending-section", label: "Trending Projects", icon: TrendingUp },
    { scrollTo: "top-rated-section", label: "Top Rated", icon: Award },
    { href: "/add-project", label: "Add Projects", icon: Plus },
  ];

  const isActive = (path: string) => location === path;

  const handleNavClick = (link: NavLink) => {
    if (link.scrollTo) {
      const element = document.getElementById(link.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Navigation className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-primary font-serif tracking-tight">
                  GetStreetCred
                </span>
                <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">
                  Rate the Streets
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.href ? (
                <Link key={link.label} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`text-sm font-medium ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    data-testid={`link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={link.label}
                  variant="ghost"
                  className="text-sm font-medium text-muted-foreground"
                  onClick={() => handleNavClick(link)}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {link.label}
                </Button>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                className="border-primary text-primary"
                onClick={() => {
                  console.log("Sign in clicked");
                  onSignIn?.();
                }}
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  console.log("Join now clicked");
                  onJoinNow?.();
                }}
                data-testid="button-join-now"
              >
                Join Now
              </Button>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {navLinks.map((link) => (
                    link.href ? (
                      <Link key={link.label} href={link.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start gap-3 ${
                            isActive(link.href)
                              ? "text-primary bg-primary/10"
                              : "text-foreground"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        key={link.label}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-foreground"
                        onClick={() => {
                          handleNavClick(link);
                          setMobileMenuOpen(false);
                        }}
                        data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Button>
                    )
                  ))}
                  <div className="border-t border-border my-4" />
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary"
                    onClick={() => {
                      console.log("Sign in clicked");
                      onSignIn?.();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-sign-in"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      console.log("Join now clicked");
                      onJoinNow?.();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-join-now"
                  >
                    Join Now
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
