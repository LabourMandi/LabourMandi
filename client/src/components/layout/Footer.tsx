import { Link } from "wouter";
import { HardHat, Mail, Phone, MapPin } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    workers: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Create Profile", href: "/profile" },
      { label: "Skills Training", href: "/training" },
      { label: "Success Stories", href: "/stories" },
    ],
    employers: [
      { label: "Post a Job", href: "/post-job" },
      { label: "Find Workers", href: "/workers" },
      { label: "Pricing", href: "/pricing" },
      { label: "Enterprise", href: "/enterprise" },
    ],
    marketplace: [
      { label: "Browse Equipment", href: "/marketplace" },
      { label: "List Equipment", href: "/list-equipment" },
      { label: "Rental Guide", href: "/rental-guide" },
      { label: "Safety Standards", href: "/safety" },
    ],
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <HardHat className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl font-[Poppins]">
                Labour<span className="text-primary">Mandi</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              India's largest marketplace for skilled labor and construction equipment.
              Connecting workers with opportunities.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="social-facebook">
                <SiFacebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="social-twitter">
                <SiX className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="social-linkedin">
                <SiLinkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="social-instagram">
                <SiInstagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Workers Links */}
          <div>
            <h4 className="font-semibold mb-4">For Workers</h4>
            <ul className="space-y-2">
              {footerLinks.workers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers Links */}
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2">
              {footerLinks.employers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-muted-foreground">
            <a href="mailto:support@labourmandi.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              support@labourmandi.com
            </a>
            <a href="tel:+911800123456" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              1800-123-4567
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mumbai, Maharashtra, India
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} LabourMandi. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
