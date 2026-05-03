"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { LuCalendar } from "react-icons/lu";

export function Discover() {

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-travel.jpg"
          alt="Solo traveler overlooking ocean at sunset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-(--background)/95 via-(--background)/70 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-(--background)/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-(--primary)/10 text-(--primary) font-medium text-sm mb-6 border border-(--primary)/20">
              Discover Your Next Adventure
            </span>
          </div>

          <h1
            className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-(--foreground) leading-tight mb-6 text-balance transition-all duration-1000 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Where Solo Travelers Meet{" "}
            <span className="text-accent">Unforgettable</span> Journeys
          </h1>

          <p
            className={`text-lg sm:text-xl text-(--muted-foreground) mb-8 leading-relaxed max-w-xl transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Connect with trusted travel agents and discover curated trip
            packages designed exclusively for solo adventurers. Your next story
            begins here.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Button size="lg" variant="solid" className="group font-medium text-base bg-(--primary) text-white rounded-lg flex items-center justify-center gap-2">
              Explore Trips
              <BsArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="font-medium text-base bg-transparent border-2 border-white hover:text-white hover:bg-red-400 rounded-lg"
            >
              I{"'"}m a Travel Agent
            </Button>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-6 max-w-md transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-(--primary)/10 mx-auto mb-2">
                <FiMapPin className="w-5 h-5 text-(--primary)" />
              </div>
              <p className="font-bold text-2xl text-(--foreground)">250+</p>
              <p className="text-sm text-(--muted-foreground)">Destinations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-(--primary)/10 mx-auto mb-2">
                <FaUser className="w-5 h-5 text-(--primary)" />
              </div>
              <p className="font-bold text-2xl text-(--foreground)">50K+</p>
              <p className="text-sm text-(--muted-foregroun)d">Solo Travelers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-(--primary)/10 mx-auto mb-2">
                <LuCalendar className="w-5 h-5 text-(--primary)" />
              </div>
              <p className="font-bold text-2xl text-(--foreground)">1.2K+</p>
              <p className="text-sm text-(--muted-foreground)">Trip Packages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-(--foreground)/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-2.5 rounded-full bg-(--foreground)/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
