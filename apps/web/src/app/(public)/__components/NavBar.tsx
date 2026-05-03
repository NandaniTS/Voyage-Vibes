"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCompass, FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-(--background) backdrop-blur-md border-b border-(--border)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-(--primary) flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiCompass className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-(--foreground)">
              Travel Junction
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#destinations"
              className="text-(--foreground)/80 hover:text-(--(--foreground)) transition-colors font-medium"
            >
              Destinations
            </Link>
            <Link
              href="#how-it-works"
              className="text-(--foreground)/80 hover:text-(--foreground) transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#agents"
              className="text-(--foreground)/80 hover:text-(--foreground) transition-colors font-medium"
            >
              For Agents
            </Link>
            <Link
              href="#about"
              className="text-(--foreground)/80 hover:text-(--foreground) transition-colors font-medium"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="font-medium cursor-pointer" 
              onPress={() => router.push("/login")}
            >
              Login
            </Button>
            <Button 
              className="font-medium cursor-pointer bg-(--primary) text-white rounded-lg" 
              onPress={() => router.push("/register")}
            >
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-(--muted) transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <RxCross1 className="w-6 h-6 text-(--foreground)" />
            ) : (
              <FiMenu className="w-6 h-6 text-(--foreground)" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-(--border) animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              <Link
                href="#destinations"
                className="text-(--foreground)/80 hover:text-(--foreground) transition-colors font-medium px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Destinations
              </Link>
              <Link
                href="#how-it-works"
                className="text-(--foreground)/80 hover:text-(--foreground) transition-colors font-medium px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#agents"
                className="text-(--foreground)/80 hover:text-(--foreground) transition-colors font-medium px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                For Agents
              </Link>
              <Link
                href="#about"
                className="text-(--foreground)/80 hover:text-(--foreground) transition-colors font-medium px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-(--border)">
                <Button 
                  variant="ghost" 
                  className="justify-start font-medium" 
                  onPress={() => {
                    router.push("/login");
                    setIsOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="font-medium" 
                  onPress={() => {
                    router.push("/register");
                    setIsOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
