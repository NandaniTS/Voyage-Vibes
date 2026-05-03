"use client";

import Link from "next/link";
import { FiCompass, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

const footerLinks = {
  explore: [
    { label: "All Destinations", href: "#" },
    { label: "Popular Trips", href: "#" },
    { label: "Travel Guides", href: "#" },
    { label: "Solo Travel Tips", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Safety Guidelines", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: FiInstagram, href: "#", label: "Instagram" },
  { icon: FiFacebook, href: "#", label: "Facebook" },
  { icon: FiTwitter, href: "#", label: "Twitter" },
  { icon: FiYoutube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer id="about" className="bg-(--card) border-t border-(--border)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-(--primary) flex items-center justify-center">
                <FiCompass className="w-5 h-5 text-(--primary-foreground)" />
              </div>
              <span className="font-serif text-xl font-bold text-(--foreground)">
                Travel Junction
              </span>
            </Link>
            <p className="text-(--muted-foreground) mb-6 max-w-xs leading-relaxed">
              Connecting solo travelers with trusted agents for unforgettable
              adventures around the world.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-(--muted) flex items-center justify-center hover:bg-(--primary) hover:text-(--primary-foreground) transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-bold text-(--foreground) mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-(--foreground) mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-(--foreground) mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-(--foreground) mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-(--border) flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-(--muted-foreground) text-sm">
            2026 Travel Junction. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-(--muted-foreground)">
            <span>Made with love for solo travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
