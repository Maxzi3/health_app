"use client";
import { FaLinkedin } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 w-30 h-15 relative">
              <Image src="/images/Logo-Light.png" alt="logo" fill />
            </div>
            <p className="text-background/70 leading-relaxed">
              Empowering health through technology. Making quality healthcare
              accessible to everyone, everywhere.
            </p>
            <nav
              aria-label="Social media links"
              className="flex gap-4 md:gap-2"
            >
              <a
                href="https://x.com/dev_maxzi"
                aria-label="Twitter"
                className="w-10 h-10 p-2 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary focus-visible:ring"
              >
                <BsTwitterX className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/dev_maxzi"
                aria-label="Instagram"
                className="w-10 p-2 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary focus-visible:ring"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10  p-2 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary focus-visible:ring"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/devmaxzi"
                aria-label="LinkedIn"
                className="w-10 h-10 p-2 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary focus-visible:ring"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Maxzi3"
                aria-label="GitHub"
                className="w-10 h-10 p-2 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary focus-visible:ring"
              >
                <FaGithub className="w-5 h-5" />
              </a>
            </nav>
          </div>

          {/* Product */}
          <div>
            <h3 id="footer-product" className="text-lg font-semibold mb-4">
              Product
            </h3>
            <ul
              aria-labelledby="footer-product"
              className="space-y-3 text-background/70"
            >
              <li>
                <a
                  href="#features"
                  className="hover:text-primary focus-visible:ring"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-primary focus-visible:ring"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-primary focus-visible:ring"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-primary focus-visible:ring"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 id="footer-company" className="text-lg font-semibold mb-4">
              Company
            </h3>
            <ul
              aria-labelledby="footer-company"
              className="space-y-3 text-background/70"
            >
              <li>
                <a
                  href="/about"
                  className="hover:text-primary focus-visible:ring"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#careers"
                  className="hover:text-primary focus-visible:ring"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#press"
                  className="hover:text-primary focus-visible:ring"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="hover:text-primary focus-visible:ring"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-background/70 text-sm mb-3">
              Stay updated with health tips and app updates
            </p>
            <form
              className="flex flex-col lg:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
            <div className="mt-4 space-y-2 text-background/70 text-sm">
              <a
                href="#help"
                className="block hover:text-primary focus-visible:ring"
              >
                Help Center
              </a>
              <a
                href="#privacy"
                className="block hover:text-primary focus-visible:ring"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="block hover:text-primary focus-visible:ring"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/70 text-sm">
            © 2025 Medify. Empowering healthier lives, one click at a time.
          </p>
          <div className="flex gap-4 text-sm text-background/70">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-health-green rounded-full"></div> HIPAA
              Compliant
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-health-green rounded-full"></div> SOC 2
              Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
