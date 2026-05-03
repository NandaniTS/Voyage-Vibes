"use client";

import React from "react"

import Link from "next/link";
import Image from "next/image";
import { BiCompass } from "react-icons/bi";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/hero-travel.jpg"
          alt="Travel adventure"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <BiCompass className="h-6 w-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold">
              Travel Junction
            </span>
          </Link>

          <div className="space-y-6">
            <blockquote className="space-y-4">
              <p className="text-xl font-medium leading-relaxed text-white/95">
                &ldquo;Travel Junction connected me with the perfect agent for
                my solo trip to Patagonia. The experience was seamless and
                unforgettable!&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                  <Image
                    src="/images/destination-1.jpg"
                    alt="Sarah Chen"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-white">Sarah Chen</p>
                  <p className="text-sm text-white/70">Solo Traveler</p>
                </div>
              </footer>
            </blockquote>

            <div className="flex gap-8 border-t border-white/20 pt-6">
              <div>
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-sm text-white/70">Happy Travelers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">1.2K+</p>
                <p className="text-sm text-white/70">Trip Packages</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">250+</p>
                <p className="text-sm text-white/70">Destinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <BiCompass className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">
              Travel Junction
            </span>
          </Link>

          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-8 py-4">
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
